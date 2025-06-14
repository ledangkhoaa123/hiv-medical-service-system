import { IsArray, IsDateString, IsNotEmpty, IsMongoId, ArrayNotEmpty, Matches, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { DoctorSchedule } from '../schemas/doctor_schedule.schema';
import { HydratedDocument } from 'mongoose';

export type DoctorScheduleDocument = HydratedDocument<DoctorSchedule>;

export enum DoctorSlotStatus {
    PENDING = 'pending',
    AVAILABLE = 'available',
    PENDING_HOLD = 'pending_hold',
    BOOKED = 'booked',
    UNAVAILABLE = 'unavailable',
}
export class CreateDoctorScheduleDto {

    @IsNotEmpty({ message: 'DoctorID không được trống' })
    @IsMongoId({ message: 'Mỗi DoctorID phải là MongoID hợp lệ' })
    doctorID: string;

    @IsNotEmpty({ message: 'Date không được trống' })
    @IsDateString({}, { message: 'Date phải đúng định dạng YYYY-MM-DD' })
    date: string;

    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'shiftStart must be in HH:mm format' })
    shiftStart: string;

    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'shiftEnd must be in HH:mm format' })
    shiftEnd: string;
    @IsOptional()
    @IsEnum(DoctorSlotStatus, { message: 'Status không hợp lệ' })
    status?: DoctorSlotStatus;
    @IsOptional()
    @IsBoolean()
    isConfirmed?: boolean;
}