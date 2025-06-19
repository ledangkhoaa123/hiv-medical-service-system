import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrescribedRegimentDto {
  @IsNotEmpty()
  @IsMongoId()
  baseRegimentID: string;

  @IsNotEmpty()
  @IsMongoId()
  prescribedBy: string;

  @IsNotEmpty()
  @IsDateString()
  prescribedDate: string;

  @IsArray()
  @IsOptional()
  customDrugs: Array<{
    drugID: string;
    dosage: string;
    frequency: string[];
    notes?: string;
  }>;
  @IsDateString()
  @IsOptional()
  endDate: string;
}
