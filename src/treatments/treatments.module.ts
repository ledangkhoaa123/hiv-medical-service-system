import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreatmentsService } from './treatments.service';
import { TreatmentsController } from './treatments.controller';
import { Treatment, TreatmentSchema } from './schemas/treatment.schema';
import { MedicalRecordsModule } from 'src/medical-records/medical-records.module';
import { MailModule } from 'src/mail/mail.module';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Treatment', schema: TreatmentSchema }]),
    MedicalRecordsModule, DoctorsModule,MailModule
    // Assuming MedicalRecordsModule is defined elsewhere
  ],
  controllers: [TreatmentsController],
  providers: [TreatmentsService],
  exports: [TreatmentsService],
})
export class TreatmentsModule {}
