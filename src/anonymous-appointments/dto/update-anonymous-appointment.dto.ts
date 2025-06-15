import { PartialType } from '@nestjs/swagger';
import { CreateAnonymousAppointmentDto } from './create-anonymous-appointment.dto';

export class UpdateAnonymousAppointmentDto extends PartialType(CreateAnonymousAppointmentDto) {}
