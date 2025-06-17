import { IsArray, IsDate, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateAppointmentDto {
    @IsNotEmpty({ message: "DoctorId không được để trống" })
    @IsMongoId({ message: "DoctorId phải là kiểu string" })
    doctorID: mongoose.Schema.Types.ObjectId;

    @IsDateString()
    date: string;

    @IsNotEmpty({ message: "ServiceID không được để trống" })
    @IsMongoId()
    serviceID: mongoose.Schema.Types.ObjectId;
    @IsOptional()
    @IsMongoId({ message: "treatmentID không đúng" })
    treatmentID: mongoose.Schema.Types.ObjectId;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true, message: 'Mỗi phần tử phải là MongoId hợp lệ' })
    extendTo?: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({ message: "StartTime không được để trống" })
    @IsDateString()
    startTime: string;    
}
