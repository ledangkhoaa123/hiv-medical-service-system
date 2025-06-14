import { PartialType } from '@nestjs/swagger';
import { CreateDoctorScheduleDto } from './create-doctor_schedule.dto';

export class UpdateDoctorScheduleDto extends PartialType(CreateDoctorScheduleDto) {}
