import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnonymousAppointment, AnonymousAppointmentSchema } from './schemas/anonymous-appointment.schema';
import { AnonymousAppointmentsService } from './anonymous-appointments.service';
// ...other imports...

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnonymousAppointment.name, schema: AnonymousAppointmentSchema }
    ])
  ],
  providers: [AnonymousAppointmentsService],
  exports: [AnonymousAppointmentsService],
})
export class AnonymousAppointmentsModule {}