import { IsString, IsEnum, IsOptional, IsDateString, MinLength } from 'class-validator';
import { AlertCategory, AlertPriority, AlertTarget } from '../entities/alert.entity';

export class CreateAlertDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  message: string;

  @IsEnum(AlertCategory)
  category: AlertCategory;

  @IsEnum(AlertPriority)
  @IsOptional()
  priority?: AlertPriority;

  @IsEnum(AlertTarget)
  @IsOptional()
  target?: AlertTarget;

  @IsDateString()
  @IsOptional()
  scheduledFor?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

