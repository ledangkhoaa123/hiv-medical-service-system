import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnonymousAppointment, AnonymousAppointmentSchema } from './schemas/anonymous-appointment.schema';
import { AnonymousAppointmentsService } from './anonymous-appointments.service';
import { AnonymousAppointmentsController } from './anonymous-appointments.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { MailModule } from 'src/mail/mail.module';
import { AnnonymousAppointmentCronService } from './appointment-cron.service';
// ...other imports...

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnonymousAppointment.name, schema: AnonymousAppointmentSchema }
    ]),
    PatientsModule, MailModule
  ],
  providers: [AnonymousAppointmentsService, AnnonymousAppointmentCronService],
  exports: [AnonymousAppointmentsService],
  controllers: [AnonymousAppointmentsController]
})
export class AnonymousAppointmentsModule {}