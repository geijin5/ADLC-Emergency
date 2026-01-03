import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SarRoute } from './sar-route.entity';

export enum SarOperationType {
  MISSION = 'mission',
  TRAINING = 'training',
}

export enum SarOperationStatus {
  ACTIVE = 'active',
  STANDBY = 'standby',
  CLEARED = 'cleared',
}

@Entity('sar_operations')
@Index(['type', 'status'])
@Index(['isPublicVisible'])
export class SarOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: SarOperationType,
    default: SarOperationType.MISSION,
  })
  type: SarOperationType;

  @Column({
    type: 'enum',
    enum: SarOperationStatus,
    default: SarOperationStatus.ACTIVE,
  })
  status: SarOperationStatus;

  @Column('jsonb', { nullable: true })
  operationalPerimeter: {
    type: 'Polygon';
    coordinates: number[][];
  };

  @Column({ default: false })
  isPublicVisible: boolean;

  @Column('text', { nullable: true })
  publicDescription: string;

  @Column('text', { nullable: true })
  internalNotes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => SarRoute, (route) => route.operation)
  routes: SarRoute[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

