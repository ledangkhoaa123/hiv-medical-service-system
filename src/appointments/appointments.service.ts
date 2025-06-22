import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose, { Types } from 'mongoose';
import { pick } from 'lodash';
import { use } from 'passport';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import {
  DoctorSlot,
  DoctorSlotDocument,
} from 'src/doctor_slots/schemas/doctor_slot.schema';
import { DoctorSlotsService } from 'src/doctor_slots/doctor_slots.service';
import { AppointmentStatus } from 'src/enums/all_enums';

@Injectable()
export class AppointmentsService {
  constructor(

    @InjectModel(Appointment.name)
    private appointmentModel: SoftDeleteModel<AppointmentDocument>,
    @InjectModel(DoctorSlot.name)
    private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
    private readonly doctorSlotService: DoctorSlotsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: IUser) {
    const {
      doctorID,
      doctorSlotID,
      patientID,
      startTime,
      date,
      medicalRecordID,
      treatmentID,
      extendTo,
      ...rest
    } = createAppointmentDto;

    const fullStartTime = new Date(`${date}T${startTime}:00+07:00`);
    const existed = await this.appointmentModel.findOne({
      doctorID,
      doctorSlotID: { $in: doctorSlotID },
      patientID: patientID,
      date: date,
      startTime: fullStartTime,
      isDeleted: false,
    });

    if (existed) {
      throw new BadRequestException('Lịch hẹn đã tồn tại!');
    }
    const newAppointment = new this.appointmentModel({
      ...createAppointmentDto,
      date: new Date(date),
      startTime: fullStartTime,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      medicalRecordID: medicalRecordID ?? null,
      treatmentID: treatmentID ?? null,
      extendTo: extendTo ?? null,
    });
    const saved = await newAppointment.save();
    // 👉 Update doctor slot status to pending_hold
    await this.doctorSlotModel.updateMany(
      { _id: { $in: doctorSlotID } },
      { $set: { status: 'pending_hold' } }, // hoặc AppointmentStatus.pending_hold nếu dùng enum
    );

    return await newAppointment.save();
  }

  findAll() {
    return this.appointmentModel.find().populate([
      {
        path: 'doctorID',
        select: { _id: 1, userID: 1 },
      },
      {
        path: 'doctorSlotID',
        select: { _id: 1, startTime: 1, endTime: 1, status: 1 },
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
    ]);
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Appointment with id=${id}`);
    }
    return await this.appointmentModel.findOne({ _id: id }).populate([
      {
        path: 'doctorID',
        select: { _id: 1, userID: 1 },
      },
      {
        path: 'doctorSlotID',
        select: { _id: 1, startTime: 1, endTime: 1, status: 1 },
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
    ]);
  }
  async findByDoctorAndDate(doctorId: string, date: string) {
    // Chuyển date về đầu ngày và cuối ngày để lọc chính xác
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
      date,
      startTime,
      medicalRecordID,
      treatmentID,
      extendTo,
      ...restFields
    } = updateDto;

    const parsedDate = date ? new Date(date) : undefined;
    const parsedStartTime =
      date && startTime ? new Date(`${date}T${startTime}:00+07:00`) : undefined;

    const updateData: any = {
      ...restFields,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
      updatedAt: new Date(),
    };

    if (parsedDate) updateData.date = parsedDate;
    if (parsedStartTime) updateData.startTime = parsedStartTime;
    if (medicalRecordID !== undefined)
      updateData.medicalRecordID = medicalRecordID ?? null;
    if (treatmentID !== undefined) updateData.treatmentID = treatmentID ?? null;
    if (extendTo !== undefined) updateData.extendTo = extendTo ?? null;

    // Optional: Kiểm tra có lịch hẹn trùng không
    const duplicate = await this.appointmentModel.findOne({
      _id: { $ne: id },
      doctorID: updateDto.doctorID || existedAppointment.doctorID,
      doctorSlotID: {
        $in: updateDto.doctorSlotID || existedAppointment.doctorSlotID,
      },
      patientID: updateDto.patientID || existedAppointment.patientID,
      date: parsedDate || existedAppointment.date,
      startTime: parsedStartTime || existedAppointment.startTime,
      isDeleted: false,
    });

    if (duplicate) {
      throw new BadRequestException(
        'Lịch hẹn đã tồn tại với thông tin trùng lặp',
      );
    }

    // Thực hiện update
    const updated = await this.appointmentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
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

  updateStatus = async (id: string, newStatus: AppointmentStatus) => {
    const existedAppointment = await this.findOne(id);

    if (!existedAppointment || existedAppointment.isDeleted) {
      throw new BadRequestException('Lịch hẹn không tồn tại hoặc đã bị xoá');
    }
    const result = await this.appointmentModel.updateOne(
      { _id: id },
      { status: newStatus },
    );
    if (result.modifiedCount === 0) {
      throw new InternalServerErrorException('Cập nhật trạng thái thất bại');
    }

    return result;
  };
}