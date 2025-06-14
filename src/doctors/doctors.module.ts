import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { DoctorSchedulesModule } from 'src/doctor_schedules/doctor_schedules.module';
import { DoctorSlotsModule } from 'src/doctor_slots/doctor_slots.module';

@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: Doctor.name, schema: DoctorSchema },
      { name: User.name, schema: UserSchema },

    ]),DoctorSchedulesModule,DoctorSlotsModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule { }
