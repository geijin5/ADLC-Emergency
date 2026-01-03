import { IsString, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeometryDto {
  type: 'LineString';
  coordinates: number[][];
}

export class CreateSarRouteDto {
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => GeometryDto)
  geometry: GeometryDto;

  @IsString()
  @IsOptional()
  description?: string;
}

