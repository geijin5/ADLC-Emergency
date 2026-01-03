import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MapFeature, MapFeatureVisibility } from './entities/map-feature.entity';
import { CreateMapFeatureDto } from './dto/create-map-feature.dto';
import { UpdateMapFeatureDto } from './dto/update-map-feature.dto';
import { User } from '../users/entities/user.entity';
import { AuditLogService } from '../common/audit-log.service';

@Injectable()
export class MapsService {
  constructor(
    @InjectRepository(MapFeature)
    private mapFeaturesRepository: Repository<MapFeature>,
    private auditLogService: AuditLogService,
  ) {}

  async create(createMapFeatureDto: CreateMapFeatureDto, user: User): Promise<MapFeature> {
    const feature = this.mapFeaturesRepository.create({
      ...createMapFeatureDto,
      createdBy: user,
    });
    const saved = await this.mapFeaturesRepository.save(feature);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'create',
      entityType: 'MapFeature',
      entityId: saved.id,
      description: `Created map feature: ${saved.name}`,
    });

    return saved;
  }

  async findAll(user?: User): Promise<MapFeature[]> {
    if (!user) {
      // Public access - only public features
      return this.mapFeaturesRepository.find({
        where: {
          visibility: MapFeatureVisibility.PUBLIC,
          isActive: true,
        },
        order: { createdAt: 'DESC' },
      });
    }
    
    // Personnel access - all features
    return this.mapFeaturesRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user?: User): Promise<MapFeature> {
    const feature = await this.mapFeaturesRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    
    if (!feature) {
      throw new NotFoundException(`Map feature with ID ${id} not found`);
    }

    if (!user && feature.visibility !== MapFeatureVisibility.PUBLIC) {
      throw new ForbiddenException('Access denied');
    }

    return feature;
  }

  async update(id: string, updateMapFeatureDto: UpdateMapFeatureDto, user: User): Promise<MapFeature> {
    const feature = await this.findOne(id, user);
    Object.assign(feature, updateMapFeatureDto);
    const updated = await this.mapFeaturesRepository.save(feature);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'update',
      entityType: 'MapFeature',
      entityId: id,
      changes: updateMapFeatureDto,
      description: `Updated map feature: ${feature.name}`,
    });

    return updated;
  }

  async remove(id: string, user: User): Promise<void> {
    const feature = await this.findOne(id, user);
    await this.mapFeaturesRepository.remove(feature);
    
    await this.auditLogService.log({
      userId: user.id,
      action: 'delete',
      entityType: 'MapFeature',
      entityId: id,
      description: `Deleted map feature: ${feature.name}`,
    });
  }
}

