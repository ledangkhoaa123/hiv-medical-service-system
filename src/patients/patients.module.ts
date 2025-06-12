import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature(
    [{ name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema }
    ])],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService] // Export service for use in other modules
})

export class PatientsModule { }
