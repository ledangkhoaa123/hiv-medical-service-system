import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import {
  MedicalRecord,
  MedicalRecordSchema,
} from './schemas/medical-record.schema';
import { Patient, PatientSchema } from 'src/patients/schemas/patient.schema';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: Patient.name, schema: PatientSchema }
    ]),
    PatientsModule
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
  exports: [MedicalRecordsService] // Export service for use in other modules
})
export class MedicalRecordsModule {}
