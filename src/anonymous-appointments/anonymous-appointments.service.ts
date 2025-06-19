import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAnonymousAppointmentDto } from './dto/create-anonymous-appointment.dto';
import { UpdateAnonymousAppointmentDto } from './dto/update-anonymous-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AnonymousAppointment, AnonymousAppointmentDocument } from './schemas/anonymous-appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import { pick } from 'lodash';
import mongoose from 'mongoose';

@Injectable()
export class AnonymousAppointmentsService {
  constructor(@InjectModel(AnonymousAppointment.name)
  private AnonymousAppointmentModel: SoftDeleteModel<AnonymousAppointmentDocument>,
  ) { }
  async create(createAnonymousAppointmentDto: CreateAnonymousAppointmentDto, user: IUser) {

    const AnonymousAppointment = await this.AnonymousAppointmentModel.create({
      ...createAnonymousAppointmentDto,
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
      createdAt: AnonymousAppointment.createdAt
    };
  }


  findAll() {
    return this.AnonymousAppointmentModel.find()
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found AnonymousAppointment with id=${id}`);
    }
    return this.AnonymousAppointmentModel.findOne({ _id: id })
      .populate({
        path: 'userID',
        select: 'name phone'
      })
  }

  async update(id: string, updateAnonymousAppointmentDto: UpdateAnonymousAppointmentDto, user: IUser) {
    const fieldsToUpdate = pick(updateAnonymousAppointmentDto, [
      'room',
      'experiences',
      'degrees',
      'specializations',
    ]);

    return this.AnonymousAppointmentModel.findOneAndUpdate(
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
    await this.AnonymousAppointmentModel.updateOne(
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
    return this.AnonymousAppointmentModel.softDelete({
      _id: id,
    });
  }
}
