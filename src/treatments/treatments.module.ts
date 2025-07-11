import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreatmentsService } from './treatments.service';
import { TreatmentsController } from './treatments.controller';
import { Treatment, TreatmentSchema } from './schemas/treatment.schema';
import { MedicalRecordsModule } from 'src/medical-records/medical-records.module';
import { MailModule } from 'src/mail/mail.module';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { TestResultsModule } from 'src/test-results/test-results.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Treatment', schema: TreatmentSchema }]),
    forwardRef(() => MedicalRecordsModule),
    DoctorsModule,MailModule, 
    forwardRef(() => TestResultsModule)
    // Assuming MedicalRecordsModule is defined elsewhere
  ],
  controllers: [TreatmentsController],
  providers: [TreatmentsService],
  exports: [TreatmentsService],
})
export class TreatmentsModule {}
