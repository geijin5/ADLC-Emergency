import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { MapFeature } from './entities/map-feature.entity';
import { UsersModule } from '../users/users.module';
import { AuditLogModule } from '../common/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MapFeature]),
    UsersModule,
    AuditLogModule,
  ],
  controllers: [MapsController],
  providers: [MapsService],
  exports: [MapsService],
})
export class MapsModule {}

