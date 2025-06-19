import { Module } from '@nestjs/common';
import { DoctorSlotsService } from './doctor_slots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorSlot, DoctorSlotSchema } from './schemas/doctor_slot.schema';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { DoctorSlotsController } from './doctor_slots.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorSlot.name, schema: DoctorSlotSchema }
    ])
  ,DoctorsModule],
  controllers:[DoctorSlotsController],
  providers: [DoctorSlotsService],
  exports: [DoctorSlotsService, MongooseModule]
})
export class DoctorSlotsModule {}