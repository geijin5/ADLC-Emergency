import { PartialType } from '@nestjs/mapped-types';
import { CreateMapFeatureDto } from './create-map-feature.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMapFeatureDto extends PartialType(CreateMapFeatureDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

