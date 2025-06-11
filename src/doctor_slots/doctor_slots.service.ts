import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDoctorSlotDto } from './dto/create-doctor_slot.dto';
import { UpdateDoctorSlotDto } from './dto/update-doctor_slot.dto';
import { DoctorSlot, DoctorSlotDocument } from './schemas/doctor_slot.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import { pick } from 'lodash';

@Injectable()
export class DoctorSlotsService {
  constructor(@InjectModel(DoctorSlot.name)
  private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
  ) { }
  async create(createDoctorSlotDto: CreateDoctorSlotDto, user: IUser) {
    const { doctorID, date, startTime, endTime, status } = createDoctorSlotDto;

    const newSlot = await this.doctorSlotModel.create({
      doctorID,
      date,
      startTime,
      endTime,
      status,
      createdBy: {
        // _id: user._id,
        // email: user.email,
      }
    });
    return {
      createdBy: {
        // _id: user._id,
        // email: user.email,
      },
      createdAt: newSlot.createdAt
    };
  };



  findAll() {
    this.doctorSlotModel.find();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found DoctorSlot with id=${id}`);
    }
    return this.doctorSlotModel.findOne({ _id: id });
  }

  update(id: string, updateDoctorSlotDto: UpdateDoctorSlotDto, user: IUser) {
    const fieldsToUpdate = pick(UpdateDoctorSlotDto, [
      'date',
      'startTime',
      'endTime',
      'status',
    ]);

    return this.doctorSlotModel.findOneAndUpdate(
      { _id: id },
      {
        ...fieldsToUpdate,
        updatedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
      { new: true }
    );
  }

  async remove(id: string, user: IUser) {
    await this.doctorSlotModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
    );
    return this.doctorSlotModel.softDelete({
      _id: id,
    });
  }
}
