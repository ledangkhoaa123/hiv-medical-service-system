import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Appointment, AppointmentSchema } from "./schemas/appointment.schema";
import { DoctorSlot, DoctorSlotSchema } from "src/doctor_slots/schemas/doctor_slot.schema";
import { DoctorSlotsModule } from "src/doctor_slots/doctor_slots.module";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { ServicesModule } from "src/services/services.module";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from "src/mail/mail.module";
import { PatientsModule } from "src/patients/patients.module";
import { DoctorsModule } from "src/doctors/doctors.module";
import { AppointmentCronService } from "./appointment-cron.service";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: DoctorSlot.name, schema: DoctorSlotSchema }
    ]),
    DoctorSlotsModule,ServicesModule,ConfigModule,MailModule,PatientsModule,DoctorsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService,AppointmentCronService],
  exports: [AppointmentsService]
})
export class AppointmentsModule {}