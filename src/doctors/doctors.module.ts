import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: Doctor.name, schema: DoctorSchema },
      { name: User.name, schema: UserSchema },
    
    ]),
    UsersModule
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule { }
