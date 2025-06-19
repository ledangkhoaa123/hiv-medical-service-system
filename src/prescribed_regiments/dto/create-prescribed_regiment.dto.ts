import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsMongoId,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import mongoose from 'mongoose';
import { DrugRegiment } from 'src/arv_regiments/dto/create-arv_regiment.dto';
import { TestType } from 'src/enums/all_enums';

class Tests{
  @IsEnum(TestType, {
    message: 'Test type không hợp lệ',
  })
  @IsNotEmpty({message: "Test type không được trống"})
  test_type: TestType;

  @IsNotEmpty({message: "Test result không được trống"})
  test_results: number | string;
}

export class CreatePrescribedRegimentDto {
  @IsNotEmpty({ message: 'Treatment ID không được để trống' })
<<<<<<< HEAD
  @IsMongoId()
<<<<<<< HEAD
  baseRegimentID: string;
=======
  treatmentID: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Base Regiment ID không được để trống' })
  @IsMongoId()
  baseRegimentID: mongoose.Schema.Types.ObjectId;
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598

=======
  @IsMongoId()
  treatmentID: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Base Regiment ID không được để trống' })
  @IsMongoId()
  baseRegimentID: mongoose.Schema.Types.ObjectId;

>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  @IsOptional()
  @IsArray({ message: 'Drugs phải là một mảng' })
  @ValidateNested({ each: true })
  @Type(() => DrugRegiment)
  customDrugs: DrugRegiment[];

  @IsOptional()
  notes?: string; 

  @IsDateString()
  @IsOptional()
  endDate: string;
}
export class SuggestRegimentDto {

  @IsNotEmpty({message: "testResults không được trống"})
  @IsArray({ message: 'Drugs phải là một mảng' })
  @ValidateNested({ each: true })
  @Type(() => Tests)
  testResults: Tests[];
}
