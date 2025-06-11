import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArvDrugsService } from './arv_drugs.service';
import { ArvDrugsController } from './arv_drugs.controller';
import { ArvDrug, ArvDrugSchema } from './schemas/arv_drug.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ArvDrug.name, schema: ArvDrugSchema }]),
  ],
  controllers: [ArvDrugsController],
  providers: [ArvDrugsService],
  exports: [ArvDrugsService],
})
export class ArvDrugsModule {}
