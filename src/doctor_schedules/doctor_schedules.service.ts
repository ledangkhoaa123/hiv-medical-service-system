import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DoctorSchedule } from './schemas/doctor_schedule.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  CreateMultiScheduleDto,
  DoctorScheduleDocument,
} from './dto/create-doctor_schedule.dto';
import {
  AppointmentShiftName,
  DoctorScheduleStatus,
  DoctorSlotStatus,
} from 'src/enums/all_enums';
import { DoctorSlotsService } from 'src/doctor_slots/doctor_slots.service';
import { IUser } from 'src/users/user.interface';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { ConfigService } from '@nestjs/config';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class DoctorSchedulesService {
  constructor(
    @InjectModel(DoctorSchedule.name)
    private doctorScheduleModel: SoftDeleteModel<DoctorScheduleDocument>,
    private readonly doctorSlotsService: DoctorSlotsService,
    private doctorsService: DoctorsService,
    private configService: ConfigService,
  ) {}
  async createSchedule(dto: CreateMultiScheduleDto, user: IUser) {
    const pairs = [];
    for (const doctorID of dto.doctorID) {
      for (const date of dto.dates) {
        pairs.push({ doctorID, date: new Date(date) });
      }
    }
    // Kiểm tra ngày đã tồn tại trong DB
    const existed = await this.doctorScheduleModel
      .find({
        $or: pairs.map((pair) => ({
          doctorID: pair.doctorID,
          date: pair.date,
          isDeleted: false,
        })),
      })
      .populate({
        path: 'doctorID',
        select: 'userID',
        populate: { path: 'userID', select: 'name' },
      });

    if (existed.length > 0) {
      const existedInfo = existed.map((e) => {
        const doctor = e.doctorID as unknown as any;
        return `Bác sĩ ${doctor.userID?.name || 'Không rõ'} ngày ${e.date.toISOString().split('T')[0]}`;
      });
      throw new BadRequestException(
        `Đã có lịch cho: ${existedInfo.join(', ')}`,
      );
    }

    // Tạo mới từng ngày
    const results = [];
    for (const pair of pairs) {
      const schedule = await this.doctorScheduleModel.create({
        doctorID: pair.doctorID,
        date: pair.date,
        status: DoctorScheduleStatus.PENDING,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      results.push(schedule);
    }
    return results;
  }

  async confirmSlots(
    scheduleId: string,
    user: IUser,
    shiftName: AppointmentShiftName,
  ) {
    const schedule = await this.findOne(scheduleId);
    if (!schedule) {
      throw new NotFoundException(
        `Không tìm thấy lịch khám với id=${scheduleId}`,
      );
    }

    //Kiểm tra quyền xác nhận
    // if (schedule.doctorID.toString() !== user._id.toString()) {
    //   throw new BadRequestException('Bạn không có quyền xác nhận schedule này');
    // }
    if (schedule.isConfirmed === true) {
      throw new BadRequestException('Schedule đã được xác nhận');
    }

    const date = schedule.date.toISOString().split('T')[0];
    const slots = this.generateTimeSlotsFromShift(
      date, // Chỉ lấy phần ngày
      shiftName,
    );

    for (const slot of slots) {
      await this.doctorSlotsService.create(
        {
          doctorID: schedule.doctorID.toString(),
          date: schedule.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
        user,
      );
    }

    // Cập nhật trạng thái schedule
    await this.update(
      scheduleId,
      { status: DoctorScheduleStatus.AVAILABLE, isConfirmed: true, shiftName },
      user,
    );

    return { message: `Đã xác nhận lịch làm ngày ${date}!` };
  }

  generateTimeSlotsFromShift(date: string, shiftName: string) {
    const slots: { startTime: Date; endTime: Date }[] = [];
    const [year, month, day] = date.split('-').map(Number);

    const parseTime = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return new Date(Date.UTC(year, month - 1, day, h, m));
    };

    // Khung giờ các ca
    const morningStart = parseTime(
      this.configService.get<string>('TIME_MORNING_WORK_START'),
    );
    const morningEnd = parseTime(
      this.configService.get<string>('TIME_MORNING_WORK_FINISH'),
    );
    const afternoonStart = parseTime(
      this.configService.get<string>('TIME_AFTERNOON_WORK_START'),
    );
    const afternoonEnd = parseTime(
      this.configService.get<string>('TIME_AFTERNOON_WORK_FINISH'),
    );
    const timeslot = Number(this.configService.get<number>('TIME_SLOT')); // Thời gian mỗi slot (60 phút)
    // Helper để tạo slot 30 phút
    const addSlots = (start: Date, end: Date) => {
      let current = new Date(start);
      while (current < end) {
        const next = new Date(current.getTime() + timeslot * 60 * 1000);
        if (next > end) break;
        slots.push({ startTime: new Date(current), endTime: new Date(next) });
        current = next;
      }
    };

    // Tạo slots theo shiftName
    switch (shiftName) {
      case 'morning':
        addSlots(morningStart, morningEnd);
        break;
      case 'afternoon':
        addSlots(afternoonStart, afternoonEnd);
        break;
      case 'full':
        addSlots(morningStart, morningEnd);
        addSlots(afternoonStart, afternoonEnd);
        break;
      default:
        throw new Error(`Shift không hợp lệ: ${shiftName}`);
    }

    return slots;
  }

  findAll() {
    return this.doctorScheduleModel
      .find({ isDeleted: false })
      .populate([
        {
          path: 'doctorID',
          select: 'userID room',
          populate: { path: 'userID', select: 'name' },
        },
      ])
      .sort({ date: 1, shiftStart: 1 });
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Sai định dạng id`);
    }
    return await this.doctorScheduleModel.findOne({ _id: id });
  }
  async getSchedule(doctorId: string, startDate: string, endDate: string) {
    // Đảm bảo startDate, endDate là chuỗi ngày hợp lệ
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Lấy tất cả schedule của bác sĩ trong khoảng ngày
    return this.doctorScheduleModel
      .find({
        doctorID: doctorId,
        date: {
          $gte: start,
          $lte: end,
        },
        isDeleted: false,
      })
      .sort({ date: 1, shiftStart: 1 });
  }
  getScheduleByToken = async (
    user: IUser,
    startDate: string,
    endDate: string,
  ) => {
    const doctor = await this.doctorsService.findByUserID(user._id);
    if (!doctor) {
      throw new NotFoundException('Không tìm thấy doctor bằng token');
    }
    // Đảm bảo startDate, endDate là chuỗi ngày hợp lệ
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Lấy tất cả schedule của bác sĩ trong khoảng ngày
    return this.doctorScheduleModel
      .find({
        doctorID: doctor.id,
        date: {
          $gte: start,
          $lte: end,
        },
        isDeleted: false,
      })
      .sort({ date: 1, shiftStart: 1 });
  };
  async update(
    id: string,
    updateDoctorScheduleDto: UpdateDoctorScheduleDto,
    user: IUser,
  ) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy dịch vụ với id=${id}`);
    }

    if (updateDoctorScheduleDto.doctorID) {
      const existed = await this.doctorScheduleModel.findOne({
        doctorID: updateDoctorScheduleDto.doctorID,
        _id: { $ne: id },
      });
      if (existed) {
        throw new BadRequestException('Lịch làm đã tồn tại');
      }
    }
    return await this.doctorScheduleModel.updateOne(
      { _id: id },
      {
        ...updateDoctorScheduleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );
  }

  async remove(id: string, user: IUser) {
    await this.doctorScheduleModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.doctorScheduleModel.softDelete({
      _id: id,
    });
  }
  async findSchedulesByDoctorAndDates(doctorID: string, dateStrings: string[]) {
    const dateRanges = dateStrings.map((dateStr) => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new BadRequestException(`Ngày không hợp lệ: ${dateStr}`);
      }

      // Normalize start & end of that day
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const end = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
      );

      return { start, end };
    });

    const conditions = dateRanges.map((range) => ({
      date: { $gte: range.start, $lt: range.end },
    }));

    return this.doctorScheduleModel.find({
      doctorID,
      isConfirmed: true,
      isDeleted: { $ne: true },
      $or: conditions,
    });
  }
  async markSchedulesAsUnavailableFromList(
  schedules: DoctorScheduleDocument[]
) {
  const scheduleIds = schedules.map(s => s._id);

  if (!scheduleIds.length) return { modifiedCount: 0, message: 'Không có lịch nào để cập nhật' };

  const result = await this.doctorScheduleModel.updateMany(
    { _id: { $in: scheduleIds } },
    {
      $set: {
        status: DoctorScheduleStatus.UNAVAILABLE,
      },
    },
  );

  return {
    modifiedCount: result.modifiedCount,
    message: `${result.modifiedCount} lịch làm việc đã chuyển sang UNAVAILABLE`,
  };
}

}
