import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescribedRegimentsService } from './prescribed_regiments.service';
import { PrescribedRegimentsController } from './prescribed_regiments.controller';
import {
  PrescribedRegiment,
  PrescribedRegimentSchema,
} from './schemas/prescribed_regiment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PrescribedRegiment.name, schema: PrescribedRegimentSchema },
    ]),
  ],
  controllers: [PrescribedRegimentsController],
  providers: [PrescribedRegimentsService],
  exports: [PrescribedRegimentsService],
})
export class PrescribedRegimentsModule {}
