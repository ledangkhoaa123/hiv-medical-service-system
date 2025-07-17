// src/doctor_slots/doctor-slot-cron.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorSlot, DoctorSlotDocument } from './schemas/doctor_slot.schema';
import { DoctorSlotStatus } from 'src/enums/all_enums';

@Injectable()
export class DoctorSlotCronService {
  private readonly logger = new Logger(DoctorSlotCronService.name);

  constructor(
    @InjectModel(DoctorSlot.name)
    private readonly doctorSlotModel: Model<DoctorSlotDocument>,
  ) {}

  @Cron('0 */15 * * * *') // Mỗi 15 phút, ở phút thứ 0, 15, 30, 45
  async markExpiredSlotsAsUnavailable() {
    const now = new Date();

    const expiredSlots = await this.doctorSlotModel.find({
      endTime: { $lt: now },
      status: DoctorSlotStatus.AVAILABLE,
      isDeleted: { $ne: true },
    });

    if (expiredSlots.length === 0) return;

    const expiredSlotIds = expiredSlots.map((slot) => slot._id);

    await this.doctorSlotModel.updateMany(
      { _id: { $in: expiredSlotIds } },
      { $set: { status: DoctorSlotStatus.UNAVAILABLE } },
    );
  }
}
