import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DoctorSchedule } from './schemas/doctor_schedule.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateDoctorScheduleDto, DoctorScheduleDocument, DoctorSlotStatus } from './dto/create-doctor_schedule.dto';
import { DoctorSlotsService } from 'src/doctor_slots/doctor_slots.service';
import { IUser } from 'src/users/user.interface';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { CreateDoctorSlotDto } from 'src/doctor_slots/dto/create-doctor_slot.dto';


@Injectable()
export class DoctorSchedulesService {
  constructor(
    @InjectModel(DoctorSchedule.name) private doctorScheduleModel: SoftDeleteModel<DoctorScheduleDocument>,
    private readonly doctorSlotsService: DoctorSlotsService
  ) { }

  async createSchedule(dto: CreateDoctorScheduleDto, user: IUser) {
    const { doctorID, date, shiftStart, shiftEnd } = dto;
    const inputStart = new Date(`${date}T${shiftStart}:00`);
    const inputEnd = new Date(`${date}T${shiftEnd}:00`);
    if (inputStart >= inputEnd) {
      throw new BadRequestException('Giờ bắt đầu phải nhỏ hơn giờ kết thúc');
    }
    const existingSchedules = await this.doctorScheduleModel.find({
      doctorID,
      date: new Date(date),
      isDeleted: false,
    });

    for (const schedule of existingSchedules) {
      const existingStart = new Date(`${date}T${schedule.shiftStart}:00`);
      const existingEnd = new Date(`${date}T${schedule.shiftEnd}:00`);
      if (inputStart < existingEnd && inputEnd > existingStart) {
        throw new BadRequestException(
          `Bác sĩ đã có lịch từ ${schedule.shiftStart} đến ${schedule.shiftEnd} vào ngày ${date}`,
        );
      }
    }

    // Chỉ tạo schedule, chưa sinh slot
    return await this.doctorScheduleModel.create({
      ...dto,
      status: 'pending', // hoặc DoctorScheduleStatus.PENDING nếu có enum
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }


  async confirmSlots(scheduleId: string, user: IUser) {

    const schedule = await this.findOne(scheduleId);
if( !schedule) {
      throw new NotFoundException(`Không tìm thấy lịch khám với id=${scheduleId}`);}

    //Kiểm tra quyền xác nhận
    // if (schedule.doctorID.toString() !== user._id.toString()) {
    //   throw new BadRequestException('Bạn không có quyền xác nhận schedule này');
    // }
    if (schedule.status === 'confirmed') {
      throw new BadRequestException('Schedule đã được xác nhận');
    }

    // Sinh slot với status "available"
    const slots = this.generateTimeSlotsFromShift(
      schedule.date.toISOString().split('T')[0],
      schedule.shiftStart,
      schedule.shiftEnd
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

    return { message: 'Đã xác nhận và sinh slot thành công!' };
  }

  private generateTimeSlotsFromShift(date: string, shiftStart: string, shiftEnd: string): { startTime: Date; endTime: Date }[] {
    const slots: { startTime: Date; endTime: Date }[] = [];
    const datePart = date.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);

    const [startHour, startMinute] = shiftStart.split(':').map(Number);
    const [endHour, endMinute] = shiftEnd.split(':').map(Number);

    // Cộng thêm 7 giờ cho múi giờ Việt Nam
    const start = new Date(Date.UTC(year, month - 1, day, startHour, startMinute));
    const end = new Date(Date.UTC(year, month - 1, day, endHour, endMinute));

    let current = new Date(start);

    while (current < end) {
      const next = new Date(current.getTime() + 30 * 60 * 1000);
      if (next > end) break;

      slots.push({
        startTime: new Date(current),
        endTime: new Date(next),
      });

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
