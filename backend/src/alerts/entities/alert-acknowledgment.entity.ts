import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Alert } from './alert.entity';

export enum AcknowledgmentStatus {
  RECEIVED = 'received',
  RESPONDING = 'responding',
  UNAVAILABLE = 'unavailable',
}

@Entity('alert_acknowledgments')
@Unique(['alertId', 'userId'])
@Index(['alertId'])
export class AlertAcknowledgment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Alert, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'alertId' })
  alert: Alert;

  @Column()
  alertId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: AcknowledgmentStatus,
    default: AcknowledgmentStatus.RECEIVED,
  })
  status: AcknowledgmentStatus;

  @Column({ nullable: true })
  acknowledgedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

