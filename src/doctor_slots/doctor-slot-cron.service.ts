// src/doctor_slots/doctor-slot-cron.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorSlot, DoctorSlotDocument } from './schemas/doctor_slot.schema';
import { DoctorSlotStatus } from 'src/enums/all_enums';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DoctorSlotCronService {
  private readonly logger = new Logger(DoctorSlotCronService.name);

  constructor(
    @InjectModel(DoctorSlot.name)
    private readonly doctorSlotModel: Model<DoctorSlotDocument>,
    private readonly configService: ConfigService,
  ) {
    const cronTime = this.configService.get<string>('CRON_EXPRESSION_EXPIRED_SLOTS');
    const job = new CronJob(
      cronTime,
      () => this.markExpiredSlotsAsUnavailable(),
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );
    job.start();
  }


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
