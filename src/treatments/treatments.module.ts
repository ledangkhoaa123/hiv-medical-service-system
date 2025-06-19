import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreatmentsService } from './treatments.service';
import { TreatmentsController } from './treatments.controller';
import { Treatment, TreatmentSchema } from './schemas/treatment.schema';
import { MedicalRecordsModule } from 'src/medical-records/medical-records.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Treatment', schema: TreatmentSchema }]),
    MedicalRecordsModule, // Assuming MedicalRecordsModule is defined elsewhere
  ],
  controllers: [TreatmentsController],
  providers: [TreatmentsService],
  exports: [TreatmentsService],
})
export class TreatmentsModule {}
