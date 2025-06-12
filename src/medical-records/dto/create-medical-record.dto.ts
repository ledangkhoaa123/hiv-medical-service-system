import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class CreateMedicalRecordDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'patientID phải là ObjectId hợp lệ' })
  patientID: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  clinicalNotes?: string;
}
