import { PartialType } from '@nestjs/swagger';
import { CreateDoctorSlotDto } from './create-doctor_slot.dto';

export class UpdateDoctorSlotDto extends PartialType(CreateDoctorSlotDto) {}
