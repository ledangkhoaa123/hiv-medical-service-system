import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescribedRegimentsService } from './prescribed_regiments.service';
import { PrescribedRegimentsController } from './prescribed_regiments.controller';
import {
  PrescribedRegiment,
  PrescribedRegimentSchema,
} from './schemas/prescribed_regiment.schema';
import { TreatmentsModule } from 'src/treatments/treatments.module';
import { ArvRegimentsModule } from 'src/arv_regiments/arv_regiments.module';
import { TestResult, TestResultSchema } from 'src/test-results/schemas/test-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrescribedRegiment.name, schema: PrescribedRegimentSchema },
      { name: TestResult.name, schema: TestResultSchema }
    ]),
    TreatmentsModule,
    ArvRegimentsModule
  ],
  controllers: [PrescribedRegimentsController],
  providers: [PrescribedRegimentsService],
  exports: [PrescribedRegimentsService],
})
export class PrescribedRegimentsModule {}
