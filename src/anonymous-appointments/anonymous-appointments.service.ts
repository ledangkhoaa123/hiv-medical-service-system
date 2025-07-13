import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnonymousAppointmentDto } from './dto/create-anonymous-appointment.dto';
import { UpdateAnonymousAppointmentDto } from './dto/update-anonymous-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  AnonymousAppointment,
  AnonymousAppointmentDocument,
} from './schemas/anonymous-appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import { pick } from 'lodash';
import mongoose from 'mongoose';
import { PatientsService } from 'src/patients/patients.service';
import { AppointmentStatus } from 'src/enums/all_enums';
import { MailService } from 'src/mail/mail.service';
import dayjs from 'dayjs';
import { parseVietnamTime } from 'src/core/time.helper';

@Injectable()
export class AnonymousAppointmentsService {
  constructor(
    @InjectModel(AnonymousAppointment.name)
    private anonymousAppointmentModel: SoftDeleteModel<AnonymousAppointmentDocument>,
    private patientsService: PatientsService,
    private mailService: MailService,
  ) { }
  async create(
    createAnonymousAppointmentDto: CreateAnonymousAppointmentDto,
    user: IUser,
  ) {
    const { dateString, timeString } = createAnonymousAppointmentDto;
    const appointmentDuration = 30;

    const startTime = parseVietnamTime(dateString, timeString);
    const endTime = new Date(startTime.getTime() + appointmentDuration * 60 * 1000);

    const existing = await this.anonymousAppointmentModel.findOne({
      date: { $gte: startTime, $lt: endTime },
      status: AppointmentStatus.confirmed,
      isDeleted: { $ne: true },
    });

    if (existing) {
      throw new ConflictException(
        `Thời gian ${timeString} ngày ${dateString} đã có người đặt. Vui lòng chọn thời gian khác.`,
      );
    }

    const patient = await this.patientsService.findOneByToken(user);
    if (!patient) {
      throw new NotFoundException('Không tìm thấy bệnh nhân');
    }

    const AnonymousAppointment = await this.anonymousAppointmentModel.create({
      patientID: patient.id,
      date: startTime,
      rawDate: dateString,
      rawTime: timeString,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return AnonymousAppointment.populate({
      path: 'patientID',
      select: 'contactEmails',
    });
  }
  confirm = async (appointmentId: string, user: IUser) => {
    const appointment = await this.anonymousAppointmentModel.findOne({
      _id: appointmentId,
    });

    if (!appointment || appointment.isDeleted) {
      throw new NotFoundException('Không tìm thấy lịch hẹn');
    }

    if (appointment.status !== AppointmentStatus.pending) {
      throw new BadRequestException('Chỉ có thể xác nhận lịch đang chờ');
    }
    const patientI4 = await this.patientsService.findOne(
      appointment.patientID as any,
    );
    appointment.status = AppointmentStatus.confirmed;
    appointment.updatedBy = {
      _id: user._id as any,
      email: user.email,
    };

    await appointment.save();
    await this.mailService.sendAnonymousAppointmentCreatedEmail({
      to: patientI4.contactEmails[0] || 'lekhoa6a7cva@gmail.com',
      patientName: patientI4.name || 'Quý Khách',
      appointmentDate: appointment.rawDate,
      shift: appointment.rawTime,
      doctorName: 'Bác sĩ Tư Vấn Ẩn Danh',
      meetingLink:
        'https://teams.live.com/meet/935591201287?p=ozj3vpi1zaVwEi5gvL',
    });

    return { message: `Đã xác nhận lịch ngày ${appointment.date}` };
  };
  getFromToken = async (user: IUser) => {
    
    const patient = await this.patientsService.findOneByToken(user);
    if (!patient) {
      throw new NotFoundException('Không tìm thấy bệnh nhân tương ứng với tài khoản');
    }

   
    return this.anonymousAppointmentModel
      .find({
        patientID: patient._id,
        isDeleted: { $ne: true },
      })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'serviceID',
          select: 'name price durationMinutes',
        },
      ]);
  };
  findAll() {
    return this.anonymousAppointmentModel.find({
      status: AppointmentStatus.pending,
    });
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Not found AnonymousAppointment with id=${id}`,
      );
    }
    return this.anonymousAppointmentModel.findOne({ _id: id }).populate({
      path: 'patientID',
      select: 'name',
    });
  }

  async update(
    id: string,
    updateAnonymousAppointmentDto: UpdateAnonymousAppointmentDto,
    user: IUser,
  ) {
    const fieldsToUpdate = pick(updateAnonymousAppointmentDto, [
      'room',
      'experiences',
      'degrees',
      'specializations',
    ]);

    return this.anonymousAppointmentModel.findOneAndUpdate(
      { _id: id },
      {
        ...fieldsToUpdate,
        updatedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
      { new: true },
    );
  }

  async remove(id: string, user: IUser) {
    await this.anonymousAppointmentModel.updateOne(
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
    return this.anonymousAppointmentModel.softDelete({
      _id: id,
    });
  }
  async checkinAppointment(id: string, user: IUser) {
    const appointment = await this.anonymousAppointmentModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!appointment) {
      throw new BadRequestException('Không tìm thấy lịch hẹn!');
    }

    if (appointment.status !== AppointmentStatus.confirmed) {
      throw new BadRequestException('Lịch hẹn chưa được xác nhận!');
    }

    const updateResult = await this.anonymousAppointmentModel.updateOne(
      { _id: id },
      {
        status: AppointmentStatus.checkin,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      throw new InternalServerErrorException(
        'Check-in thất bại, không thể cập nhật trạng thái!',
      );
    }

    const patientI4 = await this.patientsService.findOne(
      appointment.patientID as any,
    );
    if (!patientI4) {
      throw new NotFoundException('Không tìm thấy bệnh nhân!');
    }

    return { message: `Bệnh nhân ${patientI4.name} đã check-in` };
  }

  async checkoutAppointment(id: string, user: IUser) {
    const appointment = await this.anonymousAppointmentModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!appointment) {
      throw new BadRequestException('Không tìm thấy lịch hẹn!');
    }

    if (appointment.status !== AppointmentStatus.checkin) {
      throw new BadRequestException('Khách hàng chưa check-in!');
    }

    const updateResult = await this.anonymousAppointmentModel.updateOne(
      { _id: id },
      {
        status: AppointmentStatus.checkout,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      throw new InternalServerErrorException(
        'Checkout thất bại, không thể cập nhật trạng thái!',
      );
    }

    const patientI4 = await this.patientsService.findOne(
      appointment.patientID as any,
    );
    if (!patientI4) {
      throw new NotFoundException('Không tìm thấy bệnh nhân!');
    }

    return { message: `Bệnh nhân ${patientI4.name} đã checkout` };
  }
}
