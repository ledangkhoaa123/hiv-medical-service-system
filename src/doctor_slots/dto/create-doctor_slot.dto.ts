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
