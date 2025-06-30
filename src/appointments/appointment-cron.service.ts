import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { Model } from 'mongoose';
import { AppointmentStatus } from 'src/enums/all_enums';
import { DoctorSlot, DoctorSlotDocument } from 'src/doctor_slots/schemas/doctor_slot.schema';

@Injectable()
export class AppointmentCronService {
  private readonly logger = new Logger(AppointmentCronService.name);

  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(DoctorSlot.name)
    private readonly doctorSlotModel: Model<DoctorSlotDocument>
  ) {}

  @Cron('*/1 * * * *') // Mỗi phút
async cancelExpiredAppointments() {
  const now = new Date();
  // 1. Lấy danh sách appointment hết hạn
  const expiredAppointments = await this.appointmentModel.find({
    status: AppointmentStatus.pending_payment,
    paymentExpireAt: { $lt: now },
  });

  if (expiredAppointments.length === 0) return;

  // 2. Lấy slotID
  const slotIds = expiredAppointments.flatMap(a => a.doctorSlotID);

  // 3. Update status appointment
  const result = await this.appointmentModel.updateMany(
    {
      _id: { $in: expiredAppointments.map(a => a._id) },
    },
    {
      $set: { status: AppointmentStatus.payment_failed },
    },
  );

  // 4. Update status doctorSlot
  // Giả sử bạn đã inject doctorSlotModel
  await this.doctorSlotModel.updateMany(
    { _id: { $in: slotIds } },
    { $set: { status: 'available' } }
  );

  this.logger.log(`Đã huỷ ${result.modifiedCount} appointment quá hạn thanh toán và cập nhật lại doctor slots.`);
}
}
