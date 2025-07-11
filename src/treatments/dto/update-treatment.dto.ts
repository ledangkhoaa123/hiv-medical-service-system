import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatmentDto } from './create-treatment.dto';
import { IsArray, IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTestResultForTreatmentDto } from 'src/test-results/dto/create-test-result.dto';

export class UpdateTreatmentDto extends PartialType(CreateTreatmentDto) {
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @IsDateString()
  @IsOptional()
  followUpDate: Date;

  @IsOptional()
  @IsArray({ message: 'testResults phải là một mảng' })
  @ValidateNested({ each: true })
  @Type(() => CreateTestResultForTreatmentDto)
  testResults?: CreateTestResultForTreatmentDto[];
}
