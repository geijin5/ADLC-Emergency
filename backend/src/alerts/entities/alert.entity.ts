import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AlertAcknowledgment } from './alert-acknowledgment.entity';

export enum AlertCategory {
  EMERGENCY_ALERT = 'emergency_alert',
  ROAD_CLOSURE = 'road_closure',
  DETOUR = 'detour',
  PARADE_ROUTE = 'parade_route',
  AREA_CLOSURE = 'area_closure',
  SEARCH_RESCUE = 'search_rescue',
  ADVISORY = 'advisory',
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertTarget {
  PUBLIC = 'public',
  PERSONNEL = 'personnel',
  BOTH = 'both',
}

@Entity('alerts')
@Index(['isActive', 'target'])
@Index(['scheduledFor'])
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: AlertCategory,
  })
  category: AlertCategory;

  @Column({
    type: 'enum',
    enum: AlertPriority,
    default: AlertPriority.MEDIUM,
  })
  priority: AlertPriority;

  @Column({
    type: 'enum',
    enum: AlertTarget,
    default: AlertTarget.PUBLIC,
  })
  target: AlertTarget;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  scheduledFor: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  publishedAt: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => AlertAcknowledgment, (ack) => ack.alert)
  acknowledgments: AlertAcknowledgment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

