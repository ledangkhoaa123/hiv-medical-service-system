import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service, ServiceSchema } from './schemas/service.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecordsModule } from 'src/medical-records/medical-records.module';
import { TreatmentsModule } from 'src/treatments/treatments.module';

@Module({
  imports:
    [
      MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])
    ,MedicalRecordsModule,TreatmentsModule],

  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesModule],
})
export class ServicesModule { }
