import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SarOperation } from './entities/sar-operation.entity';
import { SarRoute } from './entities/sar-route.entity';
import { CreateSarOperationDto } from './dto/create-sar-operation.dto';
import { UpdateSarOperationDto } from './dto/update-sar-operation.dto';
import { CreateSarRouteDto } from './dto/create-sar-route.dto';
import { User } from '../users/entities/user.entity';
import { AuditLogService } from '../common/audit-log.service';

@Injectable()
export class SarService {
  constructor(
    @InjectRepository(SarOperation)
    private sarOperationsRepository: Repository<SarOperation>,
    @InjectRepository(SarRoute)
    private sarRoutesRepository: Repository<SarRoute>,
    private auditLogService: AuditLogService,
  ) {}

  async create(createSarOperationDto: CreateSarOperationDto, user: User): Promise<SarOperation> {
    const operation = this.sarOperationsRepository.create({
      ...createSarOperationDto,
      createdBy: user,
    });
    const saved = await this.sarOperationsRepository.save(operation);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'create',
      entityType: 'SarOperation',
      entityId: saved.id,
      description: `Created SAR operation: ${saved.name}`,
    });

    return saved;
  }

  async findAll(user?: User): Promise<SarOperation[]> {
    if (!user) {
      // Public access - only public visible operations
      return this.sarOperationsRepository.find({
        where: {
          isPublicVisible: true,
        },
        relations: ['routes'],
        order: { createdAt: 'DESC' },
      });
    }
    
    // Personnel access - all operations
    return this.sarOperationsRepository.find({
      relations: ['createdBy', 'routes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user?: User): Promise<SarOperation> {
    const operation = await this.sarOperationsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'routes'],
    });
    
    if (!operation) {
      throw new NotFoundException(`SAR operation with ID ${id} not found`);
    }

    if (!user && !operation.isPublicVisible) {
      throw new ForbiddenException('Access denied');
    }

    return operation;
  }

  async update(id: string, updateSarOperationDto: UpdateSarOperationDto, user: User): Promise<SarOperation> {
    const operation = await this.findOne(id, user);
    Object.assign(operation, updateSarOperationDto);
    const updated = await this.sarOperationsRepository.save(operation);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'update',
      entityType: 'SarOperation',
      entityId: id,
      changes: updateSarOperationDto,
      description: `Updated SAR operation: ${operation.name}`,
    });

    return updated;
  }

  async addRoute(operationId: string, createSarRouteDto: CreateSarRouteDto, user: User): Promise<SarRoute> {
    const operation = await this.findOne(operationId, user);
    const route = this.sarRoutesRepository.create({
      ...createSarRouteDto,
      operation,
    });
    return this.sarRoutesRepository.save(route);
  }

  async remove(id: string, user: User): Promise<void> {
    const operation = await this.findOne(id, user);
    await this.sarOperationsRepository.remove(operation);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'delete',
      entityType: 'SarOperation',
      entityId: id,
      description: `Deleted SAR operation: ${operation.name}`,
    });
  }
}

