import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateAppointmentDto {

    @ApiProperty({
        example: '665f8b2e2e8b2c001e7e0a11',
        description: 'ID bệnh nhân',
    })
    @IsNotEmpty({ message: "PatientID không được để trống" })
    @IsMongoId({ message: "PatientID phải là kiểu string" })
    patientID: mongoose.Schema.Types.ObjectId;

    @ApiProperty({
        example: ['665f8b2e2e8b2c001e7e0a12'],
        description: 'Mảng ID ca khám',
        type: [String],
    })
    @IsNotEmpty({ message: "DoctorSlotId không được để trống" })
    @IsArray()
    @IsMongoId({ each: true })
    doctorSlotID: string[];

    @ApiPropertyOptional({
        example: 'có thể bỏ trống',
        description: 'ID hồ sơ bệnh án',
    })
    @IsOptional()
    @IsMongoId({ message: "MedicalRecord không đúng" })
    medicalRecordID?: mongoose.Schema.Types.ObjectId;

    @ApiProperty({
        example: '665f8b2e2e8b2c001e7e0a14',
        description: 'ID dịch vụ',
    })
    @IsNotEmpty({ message: "ServiceID không được để trống" })
    @IsMongoId()
    serviceID: mongoose.Schema.Types.ObjectId;

    @ApiPropertyOptional({
        example: 'có thể bỏ trống',
        description: 'ID điều trị',
    })
    @IsOptional()
    @IsMongoId({ message: "treatmentID không đúng" })
    treatmentID?: mongoose.Schema.Types.ObjectId;
    @IsArray()
    @IsMongoId({ each: true, message: 'Mỗi phần tử phải là MongoId hợp lệ' })
    @ApiPropertyOptional({
        example: 'ID lịch hẹn mở rộng(có thể bỏ trống)',
        description: 'có thể bỏ trống',
    })
    extendTo?: mongoose.Schema.Types.ObjectId[];

}
