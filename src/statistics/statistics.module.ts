import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from 'src/appointments/schemas/appointment.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';
import { WalletTransaction, WalletTransactionSchema } from 'src/payments/schemas/walletTransaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
