import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { Model } from 'mongoose';
import { AppointmentStatus } from 'src/enums/all_enums';

@Injectable()
export class AppointmentCronService {
  private readonly logger = new Logger(AppointmentCronService.name);

  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  @Cron('*/1 * * * *') // Mỗi phút
  async cancelExpiredAppointments() {
    const now = new Date();
    const result = await this.appointmentModel.updateMany(
      {
        status: AppointmentStatus.pending_payment,
        paymentExpireAt: { $lt: now },
      },
      {
        $set: { status: AppointmentStatus.payment_failed },
      },
    );

    if (result.modifiedCount > 0) {
      this.logger.log(`Đã huỷ ${result.modifiedCount} appointment quá hạn thanh toán.`);
    }
  }
}
