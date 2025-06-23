import { IsArray, IsDate, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateAppointmentDto {
  

    @IsNotEmpty({ message: "PatientID không được để trống" })
    @IsMongoId({ message: "PatientID phải là kiểu string" })
    patientID: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "DoctorSlotId không được để trống" })
    @IsArray()
    @IsMongoId({ each: true })
    doctorSlotID: string[];

   
    @IsNotEmpty({ message: "ServiceID không được để trống" })
    @IsMongoId()
    serviceID: mongoose.Schema.Types.ObjectId;
    @IsOptional()
    @IsMongoId({ message: "treatmentID không đúng" })
    treatmentID?: mongoose.Schema.Types.ObjectId;
}
   