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

@Injectable()
export class DoctorSlotsService {
  constructor(
    @InjectModel(DoctorSlot.name)
    private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
    private doctorService: DoctorsService
  ) { }

  async create(createDoctorSlotDto: CreateDoctorSlotDto, user: IUser) {
    try {
      const slot = await this.doctorSlotModel.create({
        ...createDoctorSlotDto,
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
    return this.doctorSlotModel.find();
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
    return slot;
  }

  async findByDoctorAndDate(doctorId: string, date: string) {
    return this.doctorSlotModel.find({
      doctorID: doctorId,
      date: new Date(date),
      isDeleted: false,
    })
      .sort({ startTime: 1 })  ;
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

    const adjustedStart = new Date(start.getTime() + 7 * 60 * 60 * 1000);
    const adjustedEnd = new Date(end.getTime() + 7 * 60 * 60 * 1000);

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
}