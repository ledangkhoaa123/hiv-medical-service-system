import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTreatmentDto {
  @IsNotEmpty()
  @IsString()
  medicalRecordID: string;

  @IsNotEmpty()
  @IsString()
  doctorID: string;

  @IsNotEmpty()
  @IsDateString()
  treatmentDate: string;

  @IsString()
  @IsNotEmpty()
  note: string;

  @IsDateString()
  @IsNotEmpty()
  followUpDate: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}