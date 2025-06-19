import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArvRegimentsService } from './arv_regiments.service';
import { ArvRegimentsController } from './arv_regiments.controller';
import { ArvRegiment, ArvRegimentSchema } from './schemas/arv_regiment.schema';
import { ArvDrugsModule } from 'src/arv_drugs/arv_drugs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArvRegiment.name, schema: ArvRegimentSchema },
    ]),
    ArvDrugsModule
  ],
  controllers: [ArvRegimentsController],
  providers: [ArvRegimentsService],
  exports: [ArvRegimentsService],
})
export class ArvRegimentsModule {}
