import {
    IsNotEmpty,
    IsMongoId,
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    IsArray,
    ArrayNotEmpty,
    IsBoolean,
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


}
// confirm-slot.dto.ts


export class ConfirmSlotDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    slotIds: string[];
}

