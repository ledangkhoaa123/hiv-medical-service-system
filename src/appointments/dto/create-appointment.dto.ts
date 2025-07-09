import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import mongoose from 'mongoose';
import { UniqueArray } from 'src/doctor_schedules/dto/create-doctor_schedule.dto';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'PatientID không được để trống' })
  @IsMongoId({ message: 'PatientID phải là kiểu string' })
  patientID: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'DoctorSlotId không được để trống' })
  @IsArray()
  @IsMongoId({ each: true })
  doctorSlotID: string[];

  @IsNotEmpty({ message: 'ServiceID không được để trống' })
  @IsMongoId()
  serviceID: mongoose.Schema.Types.ObjectId;
  @IsOptional()
  @IsMongoId({ message: 'treatmentID không đúng' })
  treatmentID?: mongoose.Schema.Types.ObjectId;
}

export class CancelAppointmentForDoctorDto {
  @IsMongoId()
  @IsNotEmpty()
  doctorId: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    example: ['2025-06-20', '2025-06-21'],
    description: 'Mảng các ngày làm việc (YYYY-MM-DD), không được trùng lặp',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @Validate(UniqueArray)
  dates: string[];

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsString()
  note?: string;
}
export class CancelByDateDto {
  @IsDateString()
  @IsNotEmpty()
  from: string;

  @IsDateString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsString()
  note?: string;
}
