import { Module, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServicesModule } from 'src/services/services.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from './schemas/walletTransaction.schema';
import { PatientsModule } from 'src/patients/patients.module';
import { WalletTransactionCronService } from './payment-cron';

@Module({
  imports: [
    forwardRef(() => AppointmentsModule),
    ServicesModule,
    ConfigModule,
    PatientsModule,
    MongooseModule.forFeature([
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, WalletTransactionCronService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
