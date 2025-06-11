import {
    IsNotEmpty,
    IsMongoId,
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';
import mongoose, { Types } from 'mongoose';

export class CreateDoctorSlotDto {
    @IsNotEmpty({ message: 'doctorID không được trống' })
    @IsMongoId({ message: 'doctorID phải là MongoID hợp lệ' })
    doctorID: mongoose.Schema.Types.ObjectId;

    @IsDateString({}, { message: 'Date phải đúng định dạng YYYY-MM-DD' })
    date: Date;

    @IsDateString({}, { message: 'Date phải đúng định dạng YYYY-MM-DD' })

    startTime: Date;
    @IsDateString({}, { message: 'Date phải đúng định dạng YYYY-MM-DD' })

    endTime: Date;

    @IsNotEmpty({ message: 'Status không được trống' })
    @IsEnum(['pending', 'available', 'pending_hold', 'booked', 'unavailable'], {
        message: 'status không hợp lệ',
    })
    status: string;
    @IsNotEmpty({ message: 'appointmentID không được trống' })
    @IsMongoId({ message: 'appointmentID phải là MongoID hợp lệ' })
    appointmentID: mongoose.Schema.Types.ObjectId;
}
