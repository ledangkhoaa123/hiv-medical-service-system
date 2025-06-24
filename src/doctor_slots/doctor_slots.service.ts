/* eslint-disable prefer-const */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateDoctorSlotDto } from './dto/update-doctor_slot.dto';
import { DoctorSlot, DoctorSlotDocument } from './schemas/doctor_slot.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import { CreateDoctorSlotDto } from './dto/create-doctor_slot.dto';
import path from 'path';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { DoctorsService } from 'src/doctors/doctors.service';
import { ServicesService } from 'src/services/services.service';
import { DoctorSlotStatus } from 'src/enums/all_enums';

@Injectable()
export class DoctorSlotsService {
  constructor(
    @InjectModel(DoctorSlot.name)
    private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
    private doctorService: DoctorsService,
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
    })
      .sort({ startTime: 1 });
  }
  async findByDoctorAndDateByToken(user: IUser, date: string) {
    const doctor = await this.doctorService.findByUserID(user._id);
    return this.doctorSlotModel.find({
      doctorID: doctor.id,
      date: new Date(date),
      isDeleted: false,
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
  async findDoctorsBySlots(date: string, startTime: string, endTime: string) {
    const start = new Date(`${date}T${startTime}:00Z`);
    const end = new Date(`${date}T${endTime}:00Z`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Thời gian không hợp lệ');
    }

    const adjustedStart = new Date(start.getTime());
    const adjustedEnd = new Date(end.getTime());
    console.log('Adjusted Start:', adjustedStart);
    console.log('Adjusted End:', adjustedEnd);
    const slots = await this.doctorSlotModel.find({
      startTime: { $gte: adjustedStart },
      endTime: { $lte: adjustedEnd },
      isDeleted: false,
    }).select('doctorID');

    const uniqueDoctorIDs = Array.from(
      new Set(slots.map(slot => slot.doctorID.toString()))
    );

    const doctors = await Promise.all(
      uniqueDoctorIDs.map(id => this.doctorService.findOne(id))
    );

    return doctors;
  }
  // async findSlotByService(serviceID: string, doctorID: string, date: Date) {
  //   // Lấy thông tin service để biết duration
  //   const service = await this.serviceService.findOne(serviceID); // hoặc inject ServiceService nếu cần
  //   if (!service) throw new BadRequestException('Không tìm thấy dịch vụ');
  //   const duration = service.durationMinutes; // ví dụ: 60

  //   // Lấy tất cả slot của bác sĩ trong ngày, đã sắp xếp theo startTime
  //   const slots = await this.doctorSlotModel.find({
  //     doctorID,
  //     date,
  //     isDeleted: false,
  //     status: DoctorSlotStatus.AVAILABLE
  //   }).sort({ startTime: 1 });

  //   // Tìm các chuỗi slot liên tiếp đủ thời gian
  //   const result: { slots: typeof slots, totalMinutes: number }[] = [];
  //   for (let i = 0; i < slots.length; i++) {
  //     let total = 0;
  //     let group = [];
  //     for (let j = i; j < slots.length; j++) {
  //       const slot = slots[j];
  //       const slotMinutes = (slot.endTime.getTime() - slot.startTime.getTime()) / (60 * 1000);
  //       // Nếu là slot đầu tiên hoặc slot này nối tiếp slot trước
  //       if (
  //         group.length === 0 ||
  //         slot.startTime.getTime() === group[group.length - 1].endTime.getTime()
  //       ) {
  //         group.push(slot);
  //         total += slotMinutes;
  //         if (total >= duration) {
  //           result.push({ slots: [...group], totalMinutes: total });
  //           break; // chỉ lấy chuỗi liên tiếp đầu tiên đủ thời gian
  //         }
  //       } else {
  //         break; // không liên tiếp, dừng chuỗi này
  //       }
  //     }
  //   }

  //   // Trả về các chuỗi slot liên tiếp đủ thời gian
  //   return result.map(r => r.slots);
  // }
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
  async findSlotbyPrevious(slotID:string){
    const slot=await this.findOne(slotID);
    const time=slot.endTime
    return this.doctorSlotModel.findOne({startTime:time})
  }
}