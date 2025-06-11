import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'patientID phải là ObjectId hợp lệ' })
  patientID: string;

  @IsOptional()
  @IsMongoId({ message: 'guestID phải là ObjectId hợp lệ' })
  guestID?: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'doctorID phải là ObjectId hợp lệ' })
  doctorID: string;

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
