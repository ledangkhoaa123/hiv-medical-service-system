import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service, ServiceSchema } from './schemas/service.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:
    [
      MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])
    ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule { }
