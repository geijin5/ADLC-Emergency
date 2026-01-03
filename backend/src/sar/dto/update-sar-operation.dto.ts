import { PartialType } from '@nestjs/mapped-types';
import { CreateSarOperationDto } from './create-sar-operation.dto';

export class UpdateSarOperationDto extends PartialType(CreateSarOperationDto) {}

