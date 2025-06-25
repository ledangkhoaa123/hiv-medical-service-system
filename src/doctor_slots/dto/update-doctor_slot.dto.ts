import { PartialType } from '@nestjs/swagger';
import { CreateDoctorSlotDto } from './create-doctor_slot.dto';
import { IsEnum } from 'class-validator';
import { DoctorSlotStatus } from 'src/enums/all_enums';

export class UpdateDoctorSlotDto extends PartialType(CreateDoctorSlotDto) {
    @IsEnum(DoctorSlotStatus,{message:"Không đúng trạng thái"})
    status?:DoctorSlotStatus
}
