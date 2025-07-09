import { forwardRef, Module } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { TestResultsController } from './test-results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TestResult, TestResultSchema } from './schemas/test-result.schema';
import { TreatmentsModule } from 'src/treatments/treatments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestResult.name, schema: TestResultSchema },
    ]),
    forwardRef(() => TreatmentsModule)
  ],
  controllers: [TestResultsController],
  providers: [TestResultsService],
  exports: [TestResultsService],
})
export class TestResultsModule {}
