import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatmentDto } from './create-treatment.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateTreatmentDto extends PartialType(CreateTreatmentDto) {
  @IsDateString()
  endDate: Date;

  @IsDateString()
  @IsOptional()
  followUpDate: Date;
}
