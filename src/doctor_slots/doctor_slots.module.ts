import { Module } from '@nestjs/common';
import { DoctorSlotsService } from './doctor_slots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorSlot, DoctorSlotSchema } from './schemas/doctor_slot.schema';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { DoctorSlotsController } from './doctor_slots.controller';
import { ServicesModule } from 'src/services/services.module';
import { Doctor, DoctorSchema } from 'src/doctors/schemas/doctor.schema';
import { DoctorSlotCronService } from './doctor-slot-cron.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorSlot.name, schema: DoctorSlotSchema },
       { name: Doctor.name, schema: DoctorSchema }
    ])
  ,DoctorsModule,ServicesModule],
  controllers:[DoctorSlotsController],
  providers: [DoctorSlotsService, DoctorSlotCronService],
  exports: [DoctorSlotsService, MongooseModule]
})
export class DoctorSlotsModule {}