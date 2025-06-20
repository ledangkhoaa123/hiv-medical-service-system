import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DoctorSchedule } from './schemas/doctor_schedule.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateMultiScheduleDto, DoctorScheduleDocument } from './dto/create-doctor_schedule.dto';
import { AppointmentShiftName, DoctorSlotStatus } from 'src/enums/all_enums';
import { DoctorSlotsService } from 'src/doctor_slots/doctor_slots.service';
import { IUser } from 'src/users/user.interface';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DoctorSchedulesService {
  constructor(
    @InjectModel(DoctorSchedule.name) private doctorScheduleModel: SoftDeleteModel<DoctorScheduleDocument>,
    private readonly doctorSlotsService: DoctorSlotsService,
    private configService: ConfigService,

  ) { }
  async createSchedule(dto: CreateMultiScheduleDto, user: IUser) {
    // Kiểm tra ngày đã tồn tại trong DB
    const existed = await this.doctorScheduleModel.find({
      doctorID: dto.doctorID,
      date: { $in: dto.dates.map(d => new Date(d)) },
      isDeleted: false,
    });
    if (existed.length > 0) {
      const existedDates = existed.map(e => e.date.toISOString().split('T')[0]);
      throw new BadRequestException(`Bác sĩ đã có lịch vào các ngày: ${existedDates.join(', ')}`);
    }

    // Tạo mới từng ngày
    const results = [];
    for (const date of dto.dates) {
      const schedule = await this.doctorScheduleModel.create({
        doctorID: dto.doctorID,
        date: new Date(date),
        status: 'pending',
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      results.push(schedule);
    }
    return results;
  }

  async confirmSlots(scheduleId: string, user: IUser, shiftName: AppointmentShiftName) {
    const schedule = await this.findOne(scheduleId);
    if (!schedule) {
      throw new NotFoundException(`Không tìm thấy lịch khám với id=${scheduleId}`);
    }

    //Kiểm tra quyền xác nhận
    // if (schedule.doctorID.toString() !== user._id.toString()) {
    //   throw new BadRequestException('Bạn không có quyền xác nhận schedule này');
    // }
    if (schedule.isConfirmed === true) {
      throw new BadRequestException('Schedule đã được xác nhận');
    }

    const date = schedule.date.toISOString().split('T')[0]
    const slots = this.generateTimeSlotsFromShift(
      date, // Chỉ lấy phần ngày
      shiftName
    );

    for (const slot of slots) {
      await this.doctorSlotsService.create({
        doctorID: schedule.doctorID.toString(),
        date: schedule.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      }, user);
    }

    // Cập nhật trạng thái schedule
    await this.update(scheduleId,
      { status: DoctorSlotStatus.AVAILABLE, isConfirmed: true, shiftName }, user);

    return { message: `Đã xác nhận lịch làm ngày ${date}!` };
  }


  generateTimeSlotsFromShift(
    date: string,
    shiftName: string// Mặc định là ca full nếu không có shiftName,
  ) {
    console.log(date, shiftName);
    const slots: { startTime: Date; endTime: Date }[] = [];
    const [year, month, day] = date.split('-').map(Number);


    const parseTime = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return new Date(Date.UTC(year, month - 1, day, h, m));
    };

    // Khung giờ các ca
    const morningStart = parseTime(this.configService.get<string>('TIME_MORNING_WORK_START'));
    const morningEnd = parseTime(this.configService.get<string>('TIME_MORNING_WORK_FINISH'));
    const afternoonStart = parseTime(this.configService.get<string>('TIME_AFTERNOON_WORK_START'));
    const afternoonEnd = parseTime(this.configService.get<string>('TIME_AFTERNOON_WORK_FINISH'));
    const timeslot = Number(this.configService.get<number>('TIME_SLOT')); // Thời gian mỗi slot (60 phút)
    // Helper để tạo slot 30 phút
    const addSlots = (start: Date, end: Date) => {
      let current = new Date(start);
      while (current < end) {
        const next = new Date(current.getTime() + timeslot * 60 * 1000); // + 30 phút
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
    return this.doctorScheduleModel.find({ isDeleted: false }).sort({ date: 1, shiftStart: 1 });  
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
    return this.doctorScheduleModel.find({
      doctorID: doctorId,
      date: {
        $gte: start,
        $lte: end,
      },
      isDeleted: false,
    }).sort({ date: 1, shiftStart: 1 });
  }
  async update(id: string, updateDoctorScheduleDto: UpdateDoctorScheduleDto, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy dịch vụ với id=${id}`);
    }

    if (updateDoctorScheduleDto.doctorID) {
      const existed = await this.doctorScheduleModel.findOne({
        doctorID: updateDoctorScheduleDto.doctorID,
        _id: { $ne: id }
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
      { new: true }
    );
  }

  async remove(id: string,user: IUser) {
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
}
