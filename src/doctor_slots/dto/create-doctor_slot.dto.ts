import {
    IsNotEmpty,
    IsMongoId,
    IsDateString,
    IsOptional,

} from 'class-validator';
import mongoose, { Types } from 'mongoose';

export class CreateDoctorSlotDto {
    @IsNotEmpty({ message: 'DoctorIDs không được trống' })
    @IsMongoId({ each: true, message: 'Mỗi DoctorID phải là MongoID hợp lệ' })
    doctorID: string;

    @IsNotEmpty()
    @IsDateString({}, { message: 'Date phải đúng định dạng YYYY-MM-DD' })
    date: Date;

    @IsNotEmpty()
    @IsDateString({}, { message: 'Date phải đúng định dạng YYYY-MM-DD' })
    startTime: Date;

    @IsDateString({}, { message: 'Date phải đúng định dạng YYYY-MM-DD' })
    @IsNotEmpty()
    endTime: Date;
    @IsOptional()
    @IsMongoId({ each: true, message: 'Mỗi DoctorID phải là MongoID hợp lệ' })
    appointmentID?: string;


}
// confirm-slot.dto.ts




