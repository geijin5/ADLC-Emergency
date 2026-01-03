import { IsString, IsEnum, IsObject, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MapFeatureType, MapFeatureVisibility } from '../entities/map-feature.entity';

class GeometryDto {
  type: 'LineString' | 'Polygon' | 'Point';
  coordinates: number[][];
}

export class CreateMapFeatureDto {
  @IsString()
  name: string;

  @IsEnum(MapFeatureType)
  type: MapFeatureType;

  @IsEnum(MapFeatureVisibility)
  @IsOptional()
  visibility?: MapFeatureVisibility;

  @IsObject()
  @ValidateNested()
  @Type(() => GeometryDto)
  geometry: GeometryDto;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  incidentId?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;
}

