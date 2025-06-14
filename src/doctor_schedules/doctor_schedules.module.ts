import { Module } from '@nestjs/common';
import { DoctorSchedulesService } from './doctor_schedules.service';
import { DoctorSchedulesController } from './doctor_schedules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorSchedule, DoctorScheduleSchema } from './schemas/doctor_schedule.schema';
import { DoctorSlotsModule } from 'src/doctor_slots/doctor_slots.module';

@Module({
 imports: [
    MongooseModule.forFeature([
      { name: DoctorSchedule.name, schema: DoctorScheduleSchema }
    ]),
    DoctorSlotsModule // <--- import module này vào
  ],
  controllers: [DoctorSchedulesController],
  providers: [DoctorSchedulesService],
  exports: [DoctorSchedulesService],
})
export class DoctorSchedulesModule { }
