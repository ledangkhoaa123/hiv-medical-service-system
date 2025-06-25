import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateDoctorSlotDto } from './dto/update-doctor_slot.dto';
import { DoctorSlot, DoctorSlotDocument } from './schemas/doctor_slot.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import { CreateDoctorSlotDto } from './dto/create-doctor_slot.dto';
import { Doctor, DoctorDocument } from 'src/doctors/schemas/doctor.schema';
import { ServicesService } from 'src/services/services.service';
import { DoctorSlotStatus } from 'src/enums/all_enums';

@Injectable()
export class DoctorSlotsService {
  constructor(
    @InjectModel(DoctorSlot.name)
    private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
    @InjectModel(Doctor.name)
    private doctorModel: SoftDeleteModel<DoctorDocument>,
    private readonly serviceService: ServicesService

  ) { }

  async create(createDoctorSlotDto: CreateDoctorSlotDto, user: IUser) {
    const { appointmentID } = createDoctorSlotDto;
    try {
      const slot = await this.doctorSlotModel.create({
        ...createDoctorSlotDto,
        appointmentID: appointmentID ? new mongoose.Types.ObjectId(appointmentID) : null,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      return slot;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.doctorSlotModel.find().populate({
      path: 'doctorID',
      select: 'userID room degrees experiences',
      populate: { path: 'userID', select: 'name' },
    });;
  }
  // async findAllByDoctor(doctorId: string) {
  //   return this.doctorSlotModel.find({
  //     doctorID: doctorId,
  //     isDeleted: false,
  //   }).sort({ date: 1, startTime: 1 });
  // }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Sai định dạng id`);
    }
    const slot = await this.doctorSlotModel.findOne({ _id: id });
    if (!slot) {
      throw new BadRequestException(`Không tìm thấy lịch với id=${id}`);
    }
    return slot.populate({
      path: 'doctorID',
      select: 'userID room degrees experiences',
      populate: { path: 'userID', select: 'name' },
    });
  }

  async findByDoctorAndDate(doctorId: string, date: string) {
    return this.doctorSlotModel.find({
      doctorID: doctorId,
      date: new Date(date),
      isDeleted: false,
      status: DoctorSlotStatus.AVAILABLE
    })
      .sort({ startTime: 1 });
  }
  async update(id: string, updateDoctorSlotDto: UpdateDoctorSlotDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Sai định dạng id`);
    }
    try {
      const updated = await this.doctorSlotModel.findOneAndUpdate(
        { _id: id },
        {
          ...updateDoctorSlotDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
        { new: true }
      );
      if (!updated) {
        throw new BadRequestException(`Không tìm thấy lịch với id=${id}`);
      }
      return updated;
    } catch (error) {
      throw error;
    }
  }
  async findDoctorsBySlots(adjustedStart: Date) {

    const slots = await this.doctorSlotModel.find({
      startTime: adjustedStart,
      isDeleted: false,
      status: DoctorSlotStatus.AVAILABLE
    }).select('doctorID');


    return await this.doctorModel.find({ _id: { $in: slots.map(s => s.doctorID) } });
  }
  async findSlotByService(serviceID: string, doctorID: string, date: Date) {
    // Lấy thông tin service để biết duration
    const service = await this.serviceService.findOne(serviceID);
    if (!service) throw new BadRequestException('Không tìm thấy dịch vụ');
    const duration = service.durationMinutes; // phút

    // Lấy tất cả slot của bác sĩ trong ngày, đã sắp xếp theo startTime
    const slots = await this.doctorSlotModel.find({
      doctorID,
      date,
      isDeleted: false,
      status: DoctorSlotStatus.AVAILABLE
    }).sort({ startTime: 1 });

    const availableSlots = [];

    for (let i = 0; i < slots.length; i++) {
      let total = 0;
      let group = [];
      for (let j = i; j < slots.length; j++) {
        const slot = slots[j];
        const slotMinutes = (slot.endTime.getTime() - slot.startTime.getTime()) / (60 * 1000);

        // Nếu là slot đầu tiên hoặc slot này nối tiếp slot trước
        if (
          group.length === 0 ||
          slot.startTime.getTime() === group[group.length - 1].endTime.getTime()
        ) {
          group.push(slot);
          total += slotMinutes;
          if (total >= duration) {
            // Chỉ trả về slot đầu tiên của chuỗi liên tiếp đủ thời gian
            availableSlots.push(group[0]);
            break;
          }
        } else {
          break; // không liên tiếp, dừng chuỗi này
        }
      }
    }

    // Trả về mảng các slot có thể chọn được (slot đầu tiên của mỗi chuỗi liên tiếp đủ thời gian)
    return availableSlots;
  }
  async findSlotAvaliable(serviceID: string, date: Date) {
    const slots = await this.doctorSlotModel.find({
      date,
      isDeleted: false,
      status: DoctorSlotStatus.AVAILABLE
    }).sort({ startTime: 1 });
    const service = await this.serviceService.findOne(serviceID);
    if (!service) throw new BadRequestException('Không tìm thấy dịch vụ');
    const duration = service.durationMinutes; // phút
    const availableSlots = [];

    for (let i = 0; i < slots.length; i++) {
      let total = 0;
      let group = [];
      for (let j = i; j < slots.length; j++) {
        const slot = slots[j];
        const slotMinutes = (slot.endTime.getTime() - slot.startTime.getTime()) / (60 * 1000);

        // Nếu là slot đầu tiên hoặc slot này nối tiếp slot trước
        if (
          group.length === 0 ||
          slot.startTime.getTime() === group[group.length - 1].endTime.getTime()
        ) {
          group.push(slot);
          total += slotMinutes;
          if (total >= duration) {
            // Chỉ trả về slot đầu tiên của chuỗi liên tiếp đủ thời gian
            availableSlots.push(group[0]);
            break;
          }
        } else {
          break; // không liên tiếp, dừng chuỗi này
        }
      }
    }
    const uniqueSlots = [];
    const seenStartTimes = new Set();
    for (const slot of availableSlots) {
      const timeKey = slot.startTime.getTime();
      if (!seenStartTimes.has(timeKey)) {
        uniqueSlots.push(slot);
        seenStartTimes.add(timeKey);
      }
    }

    return uniqueSlots.map(slot => slot.startTime
    );
  }
   async findByDoctorAndStartTime(doctorId: string, startTime: Date) {
    return this.doctorSlotModel.findOne({
      doctorID: doctorId,
      startTime: startTime,
      isDeleted: false,
    });
  }

  async remove(id: string, user: IUser) {
    await this.doctorSlotModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.doctorSlotModel.softDelete({ _id: id });
  }
  async findSlotbyPrevious(slotID: string) {
    const slot = await this.findOne(slotID);
    const time = slot.endTime
    return this.doctorSlotModel.findOne({ startTime: time })
  }
 
}