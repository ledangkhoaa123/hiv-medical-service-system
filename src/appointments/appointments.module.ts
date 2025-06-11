import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:
    [
      MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }])
    ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule { }
