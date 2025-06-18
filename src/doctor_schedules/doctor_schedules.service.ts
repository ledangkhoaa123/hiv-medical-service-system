import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DoctorSchedule } from './schemas/doctor_schedule.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {  CreateMultiScheduleDto, DoctorScheduleDocument } from './dto/create-doctor_schedule.dto';
import { DoctorSlotStatus } from 'src/enums/all_enums';
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

  // async createSchedule(dto: CreateDoctorScheduleDto, user: IUser) {
  //   const { doctorID, date } = dto;



  //   const existingSchedules = await this.doctorScheduleModel.find({
  //     doctorID,
  //     date: new Date(date),
  //     isDeleted: false,
  //   });

  //   // Chỉ tạo schedule, chưa sinh slot
  //   return await this.doctorScheduleModel.create({
  //     ...dto,
  //     status: 'pending', // hoặc DoctorScheduleStatus.PENDING nếu có enum
  //     createdBy: {
  //       _id: user._id,
  //       email: user.email,
  //     },
  //   });
  // }
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

  async confirmSlots(scheduleId: string, user: IUser) {

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

    // Sinh slot với status "available"
    const date = schedule.date.toISOString().split('T')[0]
    const slots = this.generateTimeSlotsFromShift(
      date,
      this.configService.get<string>("TIME_WORK_START"),
      this.configService.get<string>("TIME_WORK_FINISH")
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
      { status: DoctorSlotStatus.AVAILABLE, isConfirmed: true }, user)

      ;

    return { message: `Đã xác nhận lịch làm ngày ${date}!` };
  }

  // private generateTimeSlotsFromShift(date: string, shiftStart: string, shiftEnd: string): { startTime: Date; endTime: Date }[] {
  //   const slots: { startTime: Date; endTime: Date }[] = [];
  //   const datePart = date.split('T')[0];
  //   const [year, month, day] = datePart.split('-').map(Number);

  //   const [startHour, startMinute] = shiftStart.split(':').map(Number);
  //   const [endHour, endMinute] = shiftEnd.split(':').map(Number);


  //   const start = new Date(Date.UTC(year, month - 1, day, startHour, startMinute));
  //   const end = new Date(Date.UTC(year, month - 1, day, endHour, endMinute));

  //   let current = new Date(start);

  //   while (current < end) {
  //     const next = new Date(current.getTime() + 30 * 60 * 1000);
  //     if (next > end) break;

  //     slots.push({
  //       startTime: new Date(current),
  //       endTime: new Date(next),
  //     });

  //     current = next;
  //   }

  //   return slots;
  // }
  private generateTimeSlotsFromShift(
    date: string,
    shiftStart: string,
    shiftEnd: string,
    breakStart = "11:30",
    breakEnd = "13:30",
  ): { startTime: Date; endTime: Date }[] {
    const slots: { startTime: Date; endTime: Date }[] = [];
    const [year, month, day] = date.split('-').map(Number);
    const parseTime = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return new Date(Date.UTC(year, month - 1, day, h, m));
    };

    const fullStart = parseTime(shiftStart);
    const fullEnd = parseTime(shiftEnd);
    const lunchStart = parseTime(breakStart);
    const lunchEnd = parseTime(breakEnd);

    // 👇 Morning slot
    let current = new Date(fullStart);
    while (current < lunchStart && current < fullEnd) {
      const next = new Date(current.getTime() + 30 * 60 * 1000);
      if (next > lunchStart || next > fullEnd) break;
      slots.push({ startTime: new Date(current), endTime: new Date(next) });
      current = next;
    }

    // 👇 Afternoon slot
    current = new Date(lunchEnd);
    while (current < fullEnd) {
      const next = new Date(current.getTime() + 30 * 60 * 1000);
      if (next > fullEnd) break;
      slots.push({ startTime: new Date(current), endTime: new Date(next) });
      current = next;
    }

    return slots;
  }


  findAll() {
    return `This action returns all doctorSchedules`;
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

  remove(id: string) {
    return `This action removes a #${id} doctorSchedule`;
  }
}
