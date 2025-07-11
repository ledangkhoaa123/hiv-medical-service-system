import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import {
  MedicalRecord,
  MedicalRecordSchema,
} from './schemas/medical-record.schema';
import { Patient, PatientSchema } from 'src/patients/schemas/patient.schema';
import { PatientsModule } from 'src/patients/patients.module';
import { TreatmentsService } from 'src/treatments/treatments.service';
import { TreatmentsModule } from 'src/treatments/treatments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: Patient.name, schema: PatientSchema }
    ]),
    PatientsModule, forwardRef(() => TreatmentsModule)
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
  exports: [MedicalRecordsService] // Export service for use in other modules
})
export class MedicalRecordsModule {}
