import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Appointment, AppointmentSchema } from "./schemas/appointment.schema";
import { DoctorSlot, DoctorSlotSchema } from "src/doctor_slots/schemas/doctor_slot.schema";
import { DoctorSlotsModule } from "src/doctor_slots/doctor_slots.module";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { DoctorsModule } from "src/doctors/doctors.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: DoctorSlot.name, schema: DoctorSlotSchema }
    ]),
    DoctorSlotsModule,
    DoctorsModule
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService]
})
export class AppointmentsModule {}