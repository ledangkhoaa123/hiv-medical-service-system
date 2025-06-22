import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose, { Types } from 'mongoose';
import { DoctorSlot, DoctorSlotDocument } from 'src/doctor_slots/schemas/doctor_slot.schema';
import { DoctorSlotsService } from 'src/doctor_slots/doctor_slots.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: SoftDeleteModel<AppointmentDocument>,
    @InjectModel(DoctorSlot.name) private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
    private readonly doctorSlotService: DoctorSlotsService
  ) { }


  async create(createAppointmentDto: CreateAppointmentDto, user: IUser) {
    const {
      doctorSlotID,
      patientID,
      medicalRecordID,
      treatmentID,
      extendTo,
      ...rest
    } = createAppointmentDto;

    //  Lấy toàn bộ slot được chọn cùng doctorID
    const slots = await this.doctorSlotModel.find({
      _id: { $in: doctorSlotID },
      isDeleted: false,
    }).select('doctorID date startTime');

    if (!slots.length) {
      throw new BadRequestException('Không tìm thấy slot bác sĩ!');
    }

    // 👉 Kiểm tra nếu có trùng lịch
    for (const slot of slots) {
      const existed = await this.appointmentModel.findOne({
        doctorID: slot.doctorID,
        doctorSlotID: slot._id,
        patientID,
        date: slot.date,
        startTime: slot.startTime,
        isDeleted: false,
      });
      if (existed) {
        throw new BadRequestException(
          `Lịch hẹn ngày ${slot.date.toISOString().split('T')[0]}, giờ ${slot.startTime.toISOString()} đã tồn tại!`
        );
      }
    }

    //  Tạo appointments
    const appointments = await Promise.all(
      slots.map((slot) =>
        new this.appointmentModel({
          doctorID: slot.doctorID,
          patientID,
          doctorSlotID: slot._id,
          date: new Date(Date.now() + 7 * 60 * 60 * 1000),
          startTime: slot.startTime,
          medicalRecordID: medicalRecordID ?? null,
          treatmentID: treatmentID ?? null,
          extendTo: extendTo ?? null,
          createdBy: {
            _id: user._id,
            email: user.email,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          ...rest,
        }).save()
      )
    );
    await this.doctorSlotModel.updateMany(
      { _id: { $in: doctorSlotID } },
      { $set: { status: 'pending_hold' } }
    );

    return appointments;
  }




  findAll() {
    return this.appointmentModel.find().
      populate([
        {
          path: 'doctorSlotID',
          select: '_id doctorID startTime  endTime date status',
          populate: {
            path: 'doctorID',
            select: 'userID room degrees experiences',
            populate: { path: 'userID', select: 'name' },
          }
        },
        {
          path: 'patientID',
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Appointment with id=${id}`);
    }
    return await this.appointmentModel.findOne({ _id: id }).
      populate([
        {
          path: 'doctorSlotID',
          select: '_id doctorID startTime  endTime date status',
          populate: {
            path: 'doctorID',
            select: 'userID room degrees experiences',
            populate: { path: 'userID', select: 'name' },
          }
        },
        {
          path: 'patientID',
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
  async findByDoctorAndDate(doctorId: string, date: string) {
    const start = new Date(date + 'T00:00:00.000Z');
    const end = new Date(date + 'T23:59:59.999Z');
    return this.appointmentModel.find({
      doctorID: doctorId,
      date: { $gte: start, $lte: end },
      isDeleted: false,
    });
  }
  async findByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate + 'T00:00:00.000Z');
    const end = new Date(endDate + 'T23:59:59.999Z');
    return this.appointmentModel.find({
      date: { $gte: start, $lte: end },
      isDeleted: false,
    });
  }

  async update(id: string, updateDto: UpdateAppointmentDto, user: IUser) {

    const existedAppointment = await this.findOne(id);

    if (!existedAppointment || existedAppointment.isDeleted) {
      throw new BadRequestException('Lịch hẹn không tồn tại hoặc đã bị xoá');
    }

    const {
      medicalRecordID,
      treatmentID,
      extendTo,
      ...restFields
    } = updateDto;


    const updateData: any = {
      ...restFields,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
      updatedAt: new Date(),
    };
    if (medicalRecordID !== undefined) updateData.medicalRecordID = medicalRecordID ?? null;
    if (treatmentID !== undefined) updateData.treatmentID = treatmentID ?? null;
    if (extendTo !== undefined) updateData.extendTo = extendTo ?? null;

    const duplicate = await this.appointmentModel.findOne({
      _id: { $ne: id },
      doctorSlotID: { $in: updateDto.doctorSlotID || existedAppointment.doctorSlotID },
      patientID: updateDto.patientID || existedAppointment.patientID,

      isDeleted: false,
    });

    if (duplicate) {
      throw new BadRequestException('Lịch hẹn đã tồn tại với thông tin trùng lặp');
    }

    // Thực hiện update
    const updated = await this.appointmentModel.findByIdAndUpdate(id, updateData, { new: true });
    return updated;
  }


  async remove(id: string, user: IUser) {
    await this.appointmentModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.appointmentModel.softDelete({
      _id: id,
    });
  }
}
