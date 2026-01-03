import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { Alert } from './entities/alert.entity';
import { AlertAcknowledgment } from './entities/alert-acknowledgment.entity';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notifications/notification.module';
import { AuditLogModule } from '../common/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert, AlertAcknowledgment]),
    UsersModule,
    NotificationModule,
    AuditLogModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}

