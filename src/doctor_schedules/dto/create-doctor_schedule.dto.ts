import { IsArray, IsDateString, IsNotEmpty, IsMongoId, ArrayNotEmpty, Matches, IsOptional, IsEnum, IsBoolean, Validate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DoctorSchedule } from '../schemas/doctor_schedule.schema';
import { HydratedDocument } from 'mongoose';
import { AppointmentShiftName, DoctorScheduleStatus, DoctorSlotStatus } from 'src/enums/all_enums';

export type DoctorScheduleDocument = HydratedDocument<DoctorSchedule>;

export class CreateDoctorScheduleDto {
  @ApiProperty({ example: '665f8b2e2e8b2c001e7e0a11', description: 'ID của bác sĩ' })
  @IsNotEmpty({ message: 'DoctorID không được trống' })
  @IsMongoId({ message: 'Mỗi DoctorID phải là MongoID hợp lệ' })
  doctorID: string;

  @ApiProperty({ example: '2025-06-20', description: 'Ngày làm việc (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Date không được trống' })
  @IsDateString({}, { message: 'Date phải đúng định dạng YYYY-MM-DD' })
  date: string;

  @ApiPropertyOptional({ enum: DoctorScheduleStatus, description: 'Trạng thái lịch làm' })
  @IsOptional()
  @IsEnum(DoctorScheduleStatus, { message: 'Status không hợp lệ' })
  status?: DoctorScheduleStatus;

  @ApiPropertyOptional({ example: false, description: 'Đã xác nhận hay chưa' })
  @IsOptional()
  @IsBoolean()
  isConfirmed?: boolean;
  @IsOptional()
  @IsEnum(AppointmentShiftName, { message: 'Buổi làm việc không hợp lệ' })
  shiftName?: AppointmentShiftName;
}
export class ConfirmSlotQueryDto {
  @ApiProperty({ enum: AppointmentShiftName })
  @IsNotEmpty({ message: 'shiftName không được để trống' })
  @IsEnum(AppointmentShiftName, { message: 'shiftName không hợp lệ' })
  shiftName: AppointmentShiftName;
}
export class ScheduleWeekBodyDto {
  @ApiProperty({ example: '2025-06-17', description: 'Ngày bắt đầu tuần (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'startDate không được trống' })
  @IsDateString({}, { message: 'startDate phải đúng định dạng YYYY-MM-DD' })
  startDate: string;

  @ApiProperty({ example: '2025-06-23', description: 'Ngày kết thúc tuần (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'endDate không được trống' })
  @IsDateString({}, { message: 'endDate phải đúng định dạng YYYY-MM-DD' })
  endDate: string;
}

export class UniqueArray {
  validate(value: any[]) {
    return Array.isArray(value) && new Set(value).size === value.length;
  }
  defaultMessage() {
    return 'dates không được chứa ngày trùng lặp';
  }
}

export class CreateMultiScheduleDto {
  @ApiProperty({
     example: ['665f8b2e2e8b2c001e7e0a11', '665f8b2e2e8b2c001e7e0a11'],
      description: 'ID của bác sĩ',
      type: [String] 
    })
  @IsNotEmpty()
  @IsMongoId({ each: true, message: 'Each permission phải là MongoObj ID' })
  @IsArray()
  doctorID: string[];

  @ApiProperty({
    example: ['2025-06-20', '2025-06-21'],
    description: 'Mảng các ngày làm việc (YYYY-MM-DD), không được trùng lặp',
    type: [String]
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  @Validate(UniqueArray)
  dates: string[];
}