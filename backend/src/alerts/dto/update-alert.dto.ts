import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertDto } from './create-alert.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAlertDto extends PartialType(CreateAlertDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

