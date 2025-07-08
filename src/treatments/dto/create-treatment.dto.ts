import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsMongoId,
  IsObject,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose, { mongo } from 'mongoose';
import { CreateTestResultDto, CreateTestResultForTreatmentDto } from 'src/test-results/dto/create-test-result.dto';

export class CreateTreatmentDto {
  @IsNotEmpty({ message: 'medicalRecordID không được để trống' })
  @IsMongoId({ message: 'medicalRecordID phải là ObjectId hợp lệ' })
  medicalRecordID: mongoose.Schema.Types.ObjectId;

  @IsString({ message: 'note phải là chuỗi' })
  @IsOptional()
  note: string;

  @IsArray({ message: 'testResults phải là một mảng' })
  @ArrayNotEmpty({ message: 'testResults không được để trống' })
  @ValidateNested({ each: true })
  @Type(() => CreateTestResultForTreatmentDto)
  testResults: CreateTestResultForTreatmentDto[];
}
