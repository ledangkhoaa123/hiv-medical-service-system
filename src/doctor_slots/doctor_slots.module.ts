import { Module } from '@nestjs/common';
import { DoctorSlotsService } from './doctor_slots.service';
import { DoctorSlotsController } from './doctor_slots.controller';
import { DoctorSlot, DoctorSlotSchema } from './schemas/doctor_slot.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature(
    [{ name: DoctorSlot.name, schema: DoctorSlotSchema }])],
  controllers: [DoctorSlotsController],
  providers: [DoctorSlotsService],
})
export class DoctorSlotsModule { }
