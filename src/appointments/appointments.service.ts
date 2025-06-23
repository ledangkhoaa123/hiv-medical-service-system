import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose, { Types } from 'mongoose';
import { DoctorSlot, DoctorSlotDocument } from 'src/doctor_slots/schemas/doctor_slot.schema';
import { DoctorSlotsService } from 'src/doctor_slots/doctor_slots.service';
import { AppointmentStatus, DoctorSlotStatus } from 'src/enums/all_enums';
import { ServicesService } from 'src/services/services.service';
import { ConfigService } from '@nestjs/config';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: SoftDeleteModel<AppointmentDocument>,
    @InjectModel(DoctorSlot.name) private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
    private readonly doctorSlotService: DoctorSlotsService,
    private readonly serviceService: ServicesService,
    private readonly configService: ConfigService,
    private doctorsService: DoctorsService
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const {
      doctorSlotID,
      patientID,
      serviceID,
      treatmentID,
    } = createAppointmentDto;

    //  Lấy toàn bộ slot được chọn cùng doctorID
    const slots = await this.doctorSlotModel.find({
      _id: { $in: doctorSlotID },
      isDeleted: false,
    }).select('doctorID date startTime');

    if (!slots.length) {
      throw new BadRequestException('Không tìm thấy slot bác sĩ!');
    }
    const slot = slots[0];


    const checkService = await this.serviceService.findOne(serviceID as any);
    if (!checkService) {
      throw new BadRequestException("Không tìm thấy Service")
    }
    const checkServiceDuration = checkService.durationMinutes
    const timeSlot = Number((this.configService.get<number>('TIME_SLOT')))
    if (checkServiceDuration > timeSlot) {
      const slot2 = await this.doctorSlotService.findSlotbyPrevious(slot._id as any);
      doctorSlotID.push(slot2._id as any)
    }

    const createApp = await this.appointmentModel.create(
      {
        doctorID: slot.doctorID,
        doctorSlotID,
        patientID,
        serviceID,
        treatmentID: treatmentID ?? null,
        date: new Date(),
        startTime: slot.startTime
      }

    )
    //  Tạo appointments

    await this.doctorSlotModel.updateMany(
      { _id: { $in: doctorSlotID } },
      { $set: { status: DoctorSlotStatus.PENDING } }
    );

    return createApp;
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

      treatmentID,
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

    if (treatmentID !== undefined) updateData.treatmentID = treatmentID ?? null;

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
  getFromToken = async (user: IUser) => {
    const doctor = await this.doctorsService.findByUserID(user._id);
    if (!doctor) {
      throw new BadRequestException("Không tìm thấy doctor bằng userID ở Token");
    }
    return await this.appointmentModel.find({
      doctorID: doctor._id,
      status: {
        $in: [AppointmentStatus.confirmed, AppointmentStatus.completed]
      }
    })
  }
}