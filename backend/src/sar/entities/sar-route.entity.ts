import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SarOperation } from './sar-operation.entity';

@Entity('sar_routes')
@Index(['operationId'])
export class SarRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SarOperation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'operationId' })
  operation: SarOperation;

  @Column()
  operationId: string;

  @Column()
  name: string;

  @Column('jsonb')
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}

