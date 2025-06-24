import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsEnum } from 'class-validator';
import { AppointmentStatus, DoctorScheduleStatus } from 'src/enums/all_enums';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
    @IsEnum(AppointmentStatus,{message:"Chỉ nhận các giá trị hợp lê"})
    status?:AppointmentStatus
}
