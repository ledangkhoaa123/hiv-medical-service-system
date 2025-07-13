import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnonymousAppointment, AnonymousAppointmentDocument } from './schemas/anonymous-appointment.schema';
import { AppointmentStatus } from 'src/enums/all_enums';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class AnnonymousAppointmentCronService {
  private readonly logger = new Logger(AnnonymousAppointmentCronService.name);

  constructor(
    @InjectModel(AnonymousAppointment.name)
    private readonly appointmentModel: SoftDeleteModel<AnonymousAppointmentDocument>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE) // chạy mỗi phút
  async cancelOverdueAppointments() {
    const now = new Date();
    const expiredTime = new Date(now.getTime() - 15 * 60 * 1000); // 15 phút trước

    const result = await this.appointmentModel.updateMany(
      {
        status: AppointmentStatus.confirmed,
        date: { $lte: expiredTime },
      },
      {
        $set: {
          status: AppointmentStatus.no_show,
        },
      },
    );

    if (result.modifiedCount > 0) {
      this.logger.log(`Đã hủy ${result.modifiedCount} lịch hẹn quá hạn.`);
    }
  }
}
