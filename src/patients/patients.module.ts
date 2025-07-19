import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { PrescribedRegiment, PrescribedRegimentSchema } from 'src/prescribed_regiments/schemas/prescribed_regiment.schema';
import { ArvRegiment, ArvRegimentSchema } from 'src/arv_regiments/schemas/arv_regiment.schema';
import { Treatment, TreatmentSchema } from 'src/treatments/schemas/treatment.schema';
import { MedicalRecord, MedicalRecordSchema } from 'src/medical-records/schemas/medical-record.schema';
import { ArvDrug, ArvDrugSchema } from 'src/arv_drugs/schemas/arv_drug.schema';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature(
    [{ name: Patient.name, schema: PatientSchema },
    { name: User.name, schema: UserSchema },
    { name: PrescribedRegiment.name, schema: PrescribedRegimentSchema },
    { name: ArvRegiment.name, schema: ArvRegimentSchema },
    { name: Treatment.name, schema: TreatmentSchema },
    { name: MedicalRecord.name, schema: MedicalRecordSchema },
    { name: ArvDrug.name, schema: ArvDrugSchema },
    ]),MailModule,ConfigModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService] // Export service for use in other modules
})

export class PatientsModule { }
