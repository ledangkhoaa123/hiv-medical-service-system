import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose, { Types } from 'mongoose';
import { pick } from 'lodash';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: SoftDeleteModel<AppointmentDocument>,
  ) { }
  async create(createAppointmentDto: CreateAppointmentDto, user: IUser) {
    const { extendTo, ...rest } = createAppointmentDto;

    const transformedExtendTo = extendTo?.map(id => new Types.ObjectId(id));

    const appointment = await this.appointmentModel.create({
      ...rest,
      extendTo: transformedExtendTo,
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
    return this.appointmentModel.find();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Appointment with id=${id}`);
    }
    return this.appointmentModel.findOne({ _id: id });
  }

  update(id: string, updateappointmentDto: UpdateAppointmentDto, user: IUser) {
    const fieldsToUpdate = pick(updateappointmentDto, [
      'doctorID',
      'patientId',
      'date',
      'serviceID',
      'medicalRecord',
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
