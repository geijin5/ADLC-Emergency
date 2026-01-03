import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Alert } from '../../alerts/entities/alert.entity';
import { ChatMessage } from '../../chat/entities/chat-message.entity';
import { MapFeature } from '../../maps/entities/map-feature.entity';
import { SarOperation } from '../../sar/entities/sar-operation.entity';
import { AuditLog } from '../../common/entities/audit-log.entity';

export enum UserRole {
  ADMIN = 'admin',
  DISPATCH = 'dispatch',
  EMERGENCY_SERVICES = 'emergency_services',
  SEARCH_RESCUE = 'search_rescue',
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMERGENCY_SERVICES,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Alert, (alert) => alert.createdBy)
  alerts: Alert[];

  @OneToMany(() => ChatMessage, (message) => message.sender)
  chatMessages: ChatMessage[];

  @OneToMany(() => MapFeature, (feature) => feature.createdBy)
  mapFeatures: MapFeature[];

  @OneToMany(() => SarOperation, (operation) => operation.createdBy)
  sarOperations: SarOperation[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];
}

