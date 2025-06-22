import { IsArray, IsDate, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateAppointmentDto {
    @IsNotEmpty({ message: "DoctorId không được để trống" })
    @IsMongoId({ message: "DoctorId phải là kiểu string" })
    doctorID: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "PatientID không được để trống" })
    @IsMongoId({ message: "PatientID phải là kiểu string" })
    patientID: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "DoctorSlotId không được để trống" })
    @IsArray()
    @IsMongoId({ each: true })
    doctorSlotID: string[];

    @IsNotEmpty({ message: "Date không được để trống" })
    @IsDateString()
    date: string;
    @IsOptional()
    @IsMongoId({ message: "MedicalRecord không đúng" })
    medicalRecordID?: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({ message: "ServiceID không được để trống" })
    @IsMongoId()
    serviceID: mongoose.Schema.Types.ObjectId;
    @IsOptional()
    @IsMongoId({ message: "treatmentID không đúng" })
    treatmentID?: mongoose.Schema.Types.ObjectId;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true, message: 'Mỗi phần tử phải là MongoId hợp lệ' })
    extendTo?: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({ message: "StartTime không được để trống" })
    startTime: string;
}