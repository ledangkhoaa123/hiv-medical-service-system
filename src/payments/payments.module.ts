import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AppointmentsModule } from 'src/appointments/appointments.module';;
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [AppointmentsModule, ServicesModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
