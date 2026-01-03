import { IsString, IsEnum, IsBoolean, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SarOperationType, SarOperationStatus } from '../entities/sar-operation.entity';

class PerimeterDto {
  type: 'Polygon';
  coordinates: number[][];
}

export class CreateSarOperationDto {
  @IsString()
  name: string;

  @IsEnum(SarOperationType)
  @IsOptional()
  type?: SarOperationType;

  @IsEnum(SarOperationStatus)
  @IsOptional()
  status?: SarOperationStatus;

  @IsObject()
  @ValidateNested()
  @Type(() => PerimeterDto)
  @IsOptional()
  operationalPerimeter?: PerimeterDto;

  @IsBoolean()
  @IsOptional()
  isPublicVisible?: boolean;

  @IsString()
  @IsOptional()
  publicDescription?: string;

  @IsString()
  @IsOptional()
  internalNotes?: string;
}

