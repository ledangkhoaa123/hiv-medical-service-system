import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class CreateMedicalRecordDto {
  @IsNotEmpty({message: 'patientID không được để trống'})
  @IsMongoId({ message: 'patientID phải là ObjectId hợp lệ' })
  patientID: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({message: 'chẩn đoán không được để trống'})
  @IsString()
  diagnosis: string;

  @IsNotEmpty({message: 'triệu chứng không được để trống'})
  @IsString()
  symptoms: string;

  @IsOptional()
  @IsString()
  clinicalNotes: string;
}
export class CreateMedicalRecordPersonalIdDto {
  @IsNotEmpty({message: 'chẩn đoán không được để trống'})
  @IsString()
  diagnosis: string;

  @IsNotEmpty({message: 'triệu chứng không được để trống'})
  @IsString()
  symptoms: string;

  @IsOptional()
  @IsString()
  clinicalNotes: string;
}
