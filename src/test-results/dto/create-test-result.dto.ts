import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTestResultDto {
  //@IsNotEmpty()
  //@IsString()
  //treatmentID: string;

  @IsString()
  @IsNotEmpty()
  test_type: string;

  @IsString()
  @IsNotEmpty()
  test_results: string;

  @IsNotEmpty()
  @IsDateString()
  test_date: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
