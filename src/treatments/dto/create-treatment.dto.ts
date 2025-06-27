import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose, { mongo } from 'mongoose';

export class CreateTreatmentDto {
  @IsNotEmpty({ message: 'medicalRecordID không được để trống' })
  @IsMongoId({ message: 'medicalRecordID phải là ObjectId hợp lệ' })
  medicalRecordID: mongoose.Schema.Types.ObjectId;

  @IsString({ message: 'note phải là chuỗi' })
  @IsOptional()
  note: string;


}
