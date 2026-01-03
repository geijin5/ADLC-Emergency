import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertTarget } from './entities/alert.entity';
import { AlertAcknowledgment, AcknowledgmentStatus } from './entities/alert-acknowledgment.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { User } from '../users/entities/user.entity';
import { NotificationService } from '../notifications/notification.service';
import { AuditLogService } from '../common/audit-log.service';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertsRepository: Repository<Alert>,
    @InjectRepository(AlertAcknowledgment)
    private acknowledgmentsRepository: Repository<AlertAcknowledgment>,
    private notificationService: NotificationService,
    private auditLogService: AuditLogService,
  ) {}

  async create(createAlertDto: CreateAlertDto, user: User): Promise<Alert> {
    const alert = this.alertsRepository.create({
      ...createAlertDto,
      createdBy: user,
    });
    const savedAlert = await this.alertsRepository.save(alert);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'create',
      entityType: 'Alert',
      entityId: savedAlert.id,
      description: `Created alert: ${savedAlert.title}`,
    });

    return savedAlert;
  }

  async findAll(user?: User): Promise<Alert[]> {
    if (!user) {
      // Public access - only published alerts targeting public or both
      return this.alertsRepository.find({
        where: [
          {
            isPublished: true,
            isActive: true,
            target: AlertTarget.PUBLIC,
          },
          {
            isPublished: true,
            isActive: true,
            target: AlertTarget.BOTH,
          },
        ],
        relations: ['createdBy'],
        order: { createdAt: 'DESC' },
      });
    }
    
    // Personnel access - all alerts
    return this.alertsRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActivePublicAlerts(): Promise<Alert[]> {
    const now = new Date();
    return this.alertsRepository
      .createQueryBuilder('alert')
      .where('alert.isPublished = :isPublished', { isPublished: true })
      .andWhere('alert.isActive = :isActive', { isActive: true })
      .andWhere('(alert.target = :public OR alert.target = :both)', {
        public: AlertTarget.PUBLIC,
        both: AlertTarget.BOTH,
      })
      .andWhere('(alert.expiresAt IS NULL OR alert.expiresAt > :now)', { now })
      .leftJoinAndSelect('alert.createdBy', 'createdBy')
      .orderBy('alert.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, user?: User): Promise<Alert> {
    const alert = await this.alertsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'acknowledgments', 'acknowledgments.user'],
    });
    
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    // Check if user has access (public can only see public alerts)
    if (!user && alert.target !== AlertTarget.PUBLIC && alert.target !== AlertTarget.BOTH) {
      throw new ForbiddenException('Access denied');
    }

    return alert;
  }

  async update(id: string, updateAlertDto: UpdateAlertDto, user: User): Promise<Alert> {
    const alert = await this.findOne(id, user);
    Object.assign(alert, updateAlertDto);
    const updated = await this.alertsRepository.save(alert);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'update',
      entityType: 'Alert',
      entityId: id,
      changes: updateAlertDto,
      description: `Updated alert: ${alert.title}`,
    });

    return updated;
  }

  async publish(id: string, user: User): Promise<Alert> {
    const alert = await this.findOne(id, user);
    alert.isPublished = true;
    alert.publishedAt = new Date();
    const published = await this.alertsRepository.save(alert);

    // Send notifications
    await this.notificationService.sendAlertNotifications(published);

    await this.auditLogService.log({
      userId: user.id,
      action: 'publish',
      entityType: 'Alert',
      entityId: id,
      description: `Published alert: ${alert.title}`,
    });

    return published;
  }

  async acknowledge(
    alertId: string,
    userId: string,
    status: AcknowledgmentStatus,
  ): Promise<AlertAcknowledgment> {
    const existing = await this.acknowledgmentsRepository.findOne({
      where: { alertId, userId },
    });

    if (existing) {
      existing.status = status;
      existing.acknowledgedAt = new Date();
      return this.acknowledgmentsRepository.save(existing);
    }

    const acknowledgment = this.acknowledgmentsRepository.create({
      alertId,
      userId,
      status,
      acknowledgedAt: new Date(),
    });

    return this.acknowledgmentsRepository.save(acknowledgment);
  }

  async remove(id: string, user: User): Promise<void> {
    const alert = await this.findOne(id, user);
    await this.alertsRepository.remove(alert);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'delete',
      entityType: 'Alert',
      entityId: id,
      description: `Deleted alert: ${alert.title}`,
    });
  }
}
