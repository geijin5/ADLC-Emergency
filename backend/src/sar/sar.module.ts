import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SarService } from './sar.service';
import { SarController } from './sar.controller';
import { SarOperation } from './entities/sar-operation.entity';
import { SarRoute } from './entities/sar-route.entity';
import { UsersModule } from '../users/users.module';
import { AuditLogModule } from '../common/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SarOperation, SarRoute]),
    UsersModule,
    AuditLogModule,
  ],
  controllers: [SarController],
  providers: [SarService],
  exports: [SarService],
})
export class SarModule {}

