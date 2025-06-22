import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityInfosService } from './facility-infos.service';
import { FacilityInfosController } from './facility-infos.controller';
import {
  FacilityInfo,
  FacilityInfoSchema,
} from './schemas/facility-infos.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FacilityInfo.name, schema: FacilityInfoSchema },
    ]),
  ],
  controllers: [FacilityInfosController],
  providers: [FacilityInfosService],
  exports: [FacilityInfosService],
})
export class FacilityInfosModule {}
