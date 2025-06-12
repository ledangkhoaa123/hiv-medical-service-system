import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDoctorSlotDto } from './dto/create-doctor_slot.dto';
import { UpdateDoctorSlotDto } from './dto/update-doctor_slot.dto';
import { DoctorSlot, DoctorSlotDocument } from './schemas/doctor_slot.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';

@Injectable()
export class DoctorSlotsService {
  constructor(
    @InjectModel(DoctorSlot.name)
    private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
  ) {}

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