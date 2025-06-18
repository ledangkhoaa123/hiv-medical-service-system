import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose, { Types } from 'mongoose';
import { pick } from 'lodash';
import { use } from 'passport';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: SoftDeleteModel<AppointmentDocument>,
  ) { }
  async create(createAppointmentDto: CreateAppointmentDto, user: IUser) {
    const { extendTo, ...rest } = createAppointmentDto;



    const appointment = await this.appointmentModel.create({
      ...rest,
      extendTo,
      createdBy: {
        // _id: user._id,
        // email: user.email,
      },
    });

    return {
      createdBy: {
        // _id: user._id,
        // email: user.email,
      },
      createdAt: appointment.createdAt,
    };
  }

  findAll() {
    return this.appointmentModel.find().
      populate([{
        path: 'doctorID',
        select: { _id: 1, userID: 1 },

      },
      {
        path: 'doctorSlotId',
        select: { _id: 1, startTime: 1, endTime: 1, status: 1 },
      },
      {
        path: 'patientId',
        select: { _id: 1, userID: 1 },

      },
      {
        path: 'serviceID',
        select: { _id: 1, name: 1, price: 1, durationMinutes: 1 },

      },
      {
        path: 'treatmentID',
        select: { _id: 1 },

      },
      ])
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Appointment with id=${id}`);
    }
    return this.appointmentModel.findOne({ _id: id }).
      populate([{
        path: 'doctorID',
        select: { _id: 1, userID: 1 },

      },
      {
        path: 'doctorSlotId',
        select: { _id: 1, startTime: 1, endTime: 1, status: 1 },
      },
      {
        path: 'patientId',
        select: { _id: 1, userID: 1 },

      },
      {
        path: 'serviceID',
        select: { _id: 1, name: 1, price: 1, durationMinutes: 1 },

      },
      {
        path: 'treatmentID',
        select: { _id: 1 },

      },
      ]);;
  }

  update(id: string, updateappointmentDto: UpdateAppointmentDto, user: IUser) {
    const fieldsToUpdate = pick(updateappointmentDto, [
      'doctorID',
      'patientId',
      'date',
      'serviceID',
      'treatmentID',
      'extendTo',
      'startTime',
      'endTime',

    ]);

    return this.appointmentModel.findOneAndUpdate(
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
    await this.appointmentModel.updateOne(
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
    return this.appointmentModel.softDelete({
      _id: id,
    });
  }
}
