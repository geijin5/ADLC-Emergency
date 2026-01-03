import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum MapFeatureType {
  ROAD_CLOSURE = 'road_closure',
  DETOUR = 'detour',
  PARADE_ROUTE = 'parade_route',
  AREA_CLOSURE = 'area_closure',
  SAR_OPERATIONAL_AREA = 'sar_operational_area',
}

export enum MapFeatureVisibility {
  PUBLIC = 'public',
  PERSONNEL = 'personnel',
}

@Entity('map_features')
@Index(['type', 'isActive'])
@Index(['visibility'])
export class MapFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: MapFeatureType,
  })
  type: MapFeatureType;

  @Column({
    type: 'enum',
    enum: MapFeatureVisibility,
    default: MapFeatureVisibility.PUBLIC,
  })
  visibility: MapFeatureVisibility;

  @Column('jsonb')
  geometry: {
    type: 'LineString' | 'Polygon' | 'Point';
    coordinates: number[][];
  };

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  incidentId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

