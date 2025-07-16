/* eslint-disable prefer-const */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CancelAppointmentDto,
  CancelAppointmentForDoctorDto,
  CancelByDateDto,
  CreateAppointmentDto,
} from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import {
  DoctorSlot,
  DoctorSlotDocument,
} from 'src/doctor_slots/schemas/doctor_slot.schema';
import { DoctorSlotsService } from 'src/doctor_slots/doctor_slots.service';
import {
  AppointmentStatus,
  DoctorSlotStatus,
  WalletType,
} from 'src/enums/all_enums';
import { ServicesService } from 'src/services/services.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { PatientsService } from 'src/patients/patients.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { DoctorSchedulesService } from 'src/doctor_schedules/doctor_schedules.service';
import { UsersService } from 'src/users/users.service';
import { format } from 'date-fns';
import { PaymentsService } from 'src/payments/payments.service';
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: SoftDeleteModel<AppointmentDocument>,
    @InjectModel(DoctorSlot.name)
    private doctorSlotModel: SoftDeleteModel<DoctorSlotDocument>,
    private readonly doctorSlotService: DoctorSlotsService,
    private readonly serviceService: ServicesService,
    private readonly configService: ConfigService,
    private usersService: UsersService,
    private readonly mailService: MailService,
    private readonly patientService: PatientsService,
    private doctorScheduleService: DoctorSchedulesService,
    private doctorsService: DoctorsService,
    private paymentsService: PaymentsService,
  ) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const { doctorSlotID, patientID, serviceID, treatmentID } =
      createAppointmentDto;
    if (!(await this.patientService.findOne(patientID as any))) {
      throw new NotFoundException('Không tìm thấy bệnh nhân');
    }
    //  Lấy toàn bộ slot được chọn cùng doctorID
    const slots = await this.doctorSlotModel
      .find({
        _id: { $in: doctorSlotID },
        isDeleted: false,
      })
      .select('doctorID date startTime status');

    if (!slots.length) {
      throw new BadRequestException('Không tìm thấy slot bác sĩ!');
    }
    const slot = slots[0];
    if (slot.status != DoctorSlotStatus.AVAILABLE) {
      throw new BadRequestException('Slot không khả dụng');
    }
    const checkService = await this.serviceService.findOne(serviceID as any);
    if (!checkService) {
      throw new BadRequestException('Không tìm thấy Service');
    }
    const checkServiceDuration = checkService.durationMinutes;
    const timeSlot = Number(this.configService.get<number>('TIME_SLOT'));
    if (checkServiceDuration > timeSlot) {
      const slot2 = await this.doctorSlotService.findSlotbyPrevious(
        slot._id as any,
      );
      doctorSlotID.push(slot2._id as any);
    }
    const now = new Date();
    const expireMinutes = Number(
      this.configService.get('TIME_CANCLE_APPOINTMENT') || 10,
    );
    const paymentExpireAt = new Date(now.getTime() + expireMinutes * 60 * 1000);
    const createApp = await this.appointmentModel.create({
      doctorID: slot.doctorID,
      doctorSlotID,
      patientID,
      serviceID,
      treatmentID: treatmentID ?? null,
      date: new Date(),
      startTime: slot.startTime,
      paymentExpireAt,
    });

    await this.doctorSlotModel.updateMany(
      { _id: { $in: doctorSlotID } },

      {
        $set: { status: DoctorSlotStatus.PENDING_HOLD },
        appointmentID: createApp._id,
      },
    );

    return createApp;
  }

  findAll() {
    return this.appointmentModel.find().populate([
      {
        path: 'doctorSlotID',
        select: '_id doctorID startTime  endTime date status',
        populate: {
          path: 'doctorID',
          select: 'userID room degrees experiences',
          populate: { path: 'userID', select: 'name' },
        },
      },
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
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
        path: 'doctorSlotID',
        select: '_id doctorID startTime  endTime date status',
        populate: {
          path: 'doctorID',
          select: 'userID room degrees experiences',
          populate: { path: 'userID', select: 'name' },
        },
      },
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
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
    const start = new Date(date + 'T00:00:00.000Z');
    const end = new Date(date + 'T23:59:59.999Z');
    return this.appointmentModel
      .find({
        doctorID: doctorId,
        date: { $gte: start, $lte: end },
        isDeleted: false,
      })
      .populate([
        {
          path: 'serviceID',
          select: 'name price durationMinutes',
        },
        {
          path: 'patientID',
          select: 'name personalID userID',
          populate: { path: 'userID', select: 'name' },
        },
      ]);
  }

  async findByDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate + 'T00:00:00.000Z');
    const end = new Date(endDate + 'T23:59:59.999Z');

    return this.appointmentModel
      .find({
        date: { $gte: start, $lte: end },
        isDeleted: false,
      })
      .populate([
        {
          path: 'serviceID',
          select: 'name price durationMinutes',
        },
        {
          path: 'patientID',
          select: 'name personalID userID',
          populate: { path: 'userID', select: 'name' },
        },
      ]);
  }

  async update(id: string, updateDto: UpdateAppointmentDto, user: IUser) {
    const existedAppointment = await this.findOne(id);

    if (!existedAppointment || existedAppointment.isDeleted) {
      throw new BadRequestException('Lịch hẹn không tồn tại hoặc đã bị xoá');
    }

    const { treatmentID, ...restFields } = updateDto;

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
      doctorSlotID: {
        $in: updateDto.doctorSlotID || existedAppointment.doctorSlotID,
      },
      patientID: updateDto.patientID || existedAppointment.patientID,

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

  async confirmAppointment(id: string, user: IUser) {
    const appointment = await this.appointmentModel.findById({
      _id: id,
      isDeleted: true,
    });
    if (!appointment) {
      throw new BadRequestException('Không tìm thấy lịch hẹn!');
    }

    if (appointment.status !== AppointmentStatus.pending) {
      if (appointment.status === AppointmentStatus.pending_payment) {
        throw new BadRequestException('Lịch hẹn chưa được thanh toán!');
      }
      throw new BadRequestException('Lịch hẹn đã được xác nhận!');
    }
    const slots = await this.doctorSlotModel
      .find({
        _id: { $in: appointment.doctorSlotID },
        isDeleted: false,
      })
      .select('doctorID date startTime');

    if (!slots.length) {
      throw new BadRequestException('Không tìm thấy slot bác sĩ!');
    }
    const slot = slots[0];

    const updateAppointment = await this.appointmentModel.updateOne(
      { _id: id },
      {
        status: AppointmentStatus.confirmed,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    if (updateAppointment.modifiedCount > 0) {
      await this.doctorSlotModel.updateMany(
        { _id: { $in: appointment.doctorSlotID } },
        { $set: { status: DoctorSlotStatus.BOOKED, appointmentID: id } },
      );
    }

    const patientI4 = await this.patientService.findOne(
      appointment.patientID as any,
    );

    await this.mailService.sendAppointmentCreatedEmail({
      to: patientI4.contactEmails[0],
      patientName: patientI4.name || 'Quý Khách',
      appointmentDate: appointment.date.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
      shift: slot.startTime.toLocaleString('vi-VN', {
        timeZone: 'UTC',
      }),
      status: AppointmentStatus.confirmed,
    });

    return { message: `Đã xác nhận lịch ngày ${slot.date}` };
  }
  getFromToken = async (user: IUser) => {
    const doctor = await this.doctorsService.findByUserID(user._id);
    if (!doctor) {
      throw new BadRequestException(
        'Không tìm thấy doctor bằng userID ở Token',
      );
    }

    return await this.appointmentModel
      .find({
        doctorID: doctor._id,
        status: {
          $in: [AppointmentStatus.checkin],
        },
      })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'serviceID',
          select: 'name price durationMinutes',
        },
        {
          path: 'patientID',
          select: 'name personalID userID',
          populate: { path: 'userID', select: 'name' },
        },
      ]);
  };
  getFromTokenDone = async (user: IUser) => {
    const doctor = await this.doctorsService.findByUserID(user._id);
    if (!doctor) {
      throw new BadRequestException(
        'Không tìm thấy doctor bằng userID ở Token',
      );
    }

    return await this.appointmentModel
      .find({
        doctorID: doctor._id,
        status: {
          $in: [AppointmentStatus.completed],
        },
      })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'serviceID',
          select: 'name price durationMinutes',
        },
        {
          path: 'patientID',
          select: 'name personalID userID',
          populate: { path: 'userID', select: 'name' },
        },
      ]);
  };
  getFromTokenPatient = async (user: IUser) => {
    const patient = await this.patientService.findOneByToken(user);

    if (!patient) {
      throw new BadRequestException(
        'Không tìm thấy patient bằng userID ở Token',
      );
    }

    return await this.appointmentModel
      .find({
        patientID: patient._id,
      })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'serviceID',
          select: 'name price durationMinutes',
        },
        {
          path: 'patientID',
          select: 'name personalID userID',
          populate: { path: 'userID', select: 'name' },
        },
        {
          path: 'doctorID',
          select: 'userID room',
          populate: { path: 'userID', select: 'name' },
        },
      ]);
  };
  cancelAppointmentForDoctor = async (
    canceldto: CancelAppointmentForDoctorDto,
    user: IUser,
  ) => {
    let countCancelled = 0;
    let refundTotal = 0;
    const schedules =
      await this.doctorScheduleService.findSchedulesByDoctorAndDates(
        canceldto.doctorId as any,
        canceldto.dates,
      );
    if (schedules.length == 0) {
      throw new NotFoundException('Không tìm thấy lịch làm của bác sĩ');
    }
    const allSlots = schedules.flatMap((schedule) => {
      const dateStr = schedule.date.toISOString().split('T')[0]; // YYYY-MM-DD
      return this.doctorScheduleService.generateTimeSlotsFromShift(
        dateStr,
        schedule.shiftName,
      );
    });
    const slotStartTimes = allSlots.map((slot) => slot.startTime);

    // Tìm các DoctorSlot đã được đặt
    const bookedSlots =
      await this.doctorSlotService.findBookedSlotsByStartTimesByDoctor(
        canceldto.doctorId as any,
        canceldto.dates,
        slotStartTimes,
      );
    await this.doctorSlotService.updateSlotStatuses(
      canceldto.doctorId as any,
      canceldto.dates,
      allSlots,
      DoctorSlotStatus.UNAVAILABLE,
    );
    for (const slot of bookedSlots) {
      if (slot.appointmentID) {
        const appointment = await this.appointmentModel.findById(
          slot.appointmentID,
        );
        if (
          appointment &&
          ![
            AppointmentStatus.refunded_by_staff,
            AppointmentStatus.cancelled_by_staff,
          ].includes(appointment.status)
        ) {
          if (appointment.status !== AppointmentStatus.pending_payment) {
            const service = await this.serviceService.findOne(
              appointment.serviceID as any,
            );
            const patient = await this.patientService.findOne(
              appointment.patientID as any,
            );
            const transaction =
              await this.paymentsService.createWalletTransaction(
                patient._id as any,
                service.price,
                WalletType.REFUND,
                canceldto.reason,
                appointment._id as any,
              );
            if (!transaction) {
              throw new InternalServerErrorException(
                'Không thể tạo giao dịch hoàn tiền',
              );
            }
            await this.patientService.refundWallet(
              appointment.patientID.toString(),
              service.price,
            );
            refundTotal += service.price;
            await this.appointmentModel.updateOne(
              { _id: appointment._id },
              {
                $set: {
                  status: AppointmentStatus.refunded_by_staff,
                  cancellationReason: canceldto.reason,
                  canceledAt: new Date(),
                  canceledBy: { _id: user._id, email: user.email },
                },
              },
            );

            await this.mailService.sendAppointmentCanceledEmail({
              to: patient.contactEmails[0] || 'khoaldse184650@fpt.edu.vn',
              patientName: patient.name || 'No Name',
              appointmentDate: format(appointment.startTime, 'dd/MM/yyyy'),
              reason: canceldto.reason,
              shift: format(appointment.startTime, 'HH:mm'),
              refundAmount: service.price,
            });
          } else {
            // Chỉ huỷ, không hoàn tiền
            await this.appointmentModel.updateOne(
              { _id: appointment._id },
              {
                $set: {
                  status: AppointmentStatus.cancelled_by_staff,
                  cancellationReason: canceldto.reason,
                  canceledAt: new Date(),
                  canceledBy: { _id: user._id, email: user.email },
                },
              },
            );
          }
          countCancelled++;
        }
      }
    }
    await this.doctorScheduleService.markSchedulesAsUnavailableFromList(
      schedules,
    );
    return {
      cancelledSchedules: schedules.length,
      totalSlotsAffected: allSlots.length,
      slotsBooked: bookedSlots.length,
      appointmentsCancelled: countCancelled,
      refundsIssued: refundTotal,
      message: 'Đã huỷ lịch và hoàn tiền (nếu có) thành công.',
    };
  };
  cancelAppointment = async (canceldto: CancelAppointmentDto, user: IUser) => {
    const appointment = await this.appointmentModel.findById(
      canceldto.appoinmentId,
    );

    if (!appointment) {
      throw new NotFoundException('Không tìm thấy lịch hẹn');
    }

    // Chỉ cho phép huỷ nếu đã được xác nhận và thanh toán
    if (
      ![AppointmentStatus.pending, AppointmentStatus.confirmed].includes(
        appointment.status,
      )
    ) {
      throw new BadRequestException(
        'Chỉ được huỷ lịch đã thanh toán và chưa khám',
      );
    }

    // Kiểm tra slot liên quan
    const slotIds = appointment.doctorSlotID;
    if (!slotIds || slotIds.length === 0) {
      throw new NotFoundException('Không tìm thấy các slot trong lịch hẹn');
    }

    // Hoàn tiền nếu cần
    const service = await this.serviceService.findOne(
      appointment.serviceID as any,
    );
    const patient = await this.patientService.findOne(
      appointment.patientID as any,
    );
    let refundTotal = 0;
    if (!service) {
      throw new NotFoundException(
        'Không tìm thấy dịch vụ liên quan đến lịch hẹn',
      );
    }
    if (!patient) {
      throw new NotFoundException(
        'Không tìm thấy bệnh nhân liên quan đến lịch hẹn',
      );
    }
    const transaction = await this.paymentsService.createWalletTransaction(
      patient._id as any,
      service.price,
      WalletType.REFUND,
      canceldto.reason,
      appointment._id as any,
    );
    if (!transaction) {
      throw new InternalServerErrorException(
        'Không thể tạo giao dịch hoàn tiền',
      );
    }
    await this.patientService.refundWallet(
      appointment.patientID.toString(),
      service.price,
    );
    refundTotal = service.price;

    // Cập nhật appointment status
    const updatedStatus = AppointmentStatus.refunded_by_staff;

    await this.appointmentModel.updateOne(
      { _id: canceldto.appoinmentId },
      {
        $set: {
          status: updatedStatus,
          cancellationReason: 'Được huỷ bởi nhân viên',
          canceledAt: new Date(),
          canceledBy: { _id: user._id, email: user.email },
        },
      },
    );

    // Cập nhật trạng thái các slot thành UNAVAILABLE
    await this.doctorSlotService.updateManySlotStatuses(
      slotIds as any,
      DoctorSlotStatus.UNAVAILABLE,
    );

    // Gửi email
    await this.mailService.sendAppointmentCanceledEmail({
      to: patient.contactEmails[0] || 'lekhoa6a7cva@gmail.com',
      patientName: patient.name || 'No Name',
      appointmentDate: format(appointment.startTime, 'dd/MM/yyyy'),
      reason: 'Được huỷ bởi nhân viên',
      shift: format(appointment.startTime, 'HH:mm'),
      refundAmount: refundTotal,
    });

    return {
      appointmentId: canceldto.appoinmentId,
      slotsAffected: slotIds.length,
      refundedAmount: refundTotal,
      message: `Đã huỷ lịch hẹn thành công${refundTotal ? ' và hoàn tiền' : ''}.`,
    };
  };

  cancelAppointmentForHospital = async (
    canceldto: CancelByDateDto,
    user: IUser,
  ) => {
    const fromDate = new Date(canceldto.from);
    const toDate = new Date(canceldto.to);

    if (fromDate > toDate) {
      throw new BadRequestException(
        'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc',
      );
    }
    let countCancelled = 0;
    let refundTotal = 0;
    const schedules = await this.doctorScheduleService.getScheduleByDateRange(
      canceldto.from,
      canceldto.to,
    );
    if (schedules.length == 0) {
      throw new NotFoundException('Không tìm thấy lịch làm của bác sĩ');
    }
    const allSlots = schedules.flatMap((schedule) => {
      const dateStr = schedule.date.toISOString().split('T')[0]; // YYYY-MM-DD
      return this.doctorScheduleService.generateTimeSlotsFromShift(
        dateStr,
        schedule.shiftName,
      );
    });
    const slotStartTimes = allSlots.map((slot) => slot.startTime);

    // Tìm các DoctorSlot đã được đặt
    const bookedSlots =
      await this.doctorSlotService.findBookedSlotsByStartTimesByDates(
        canceldto.from,
        canceldto.to,
        slotStartTimes,
      );
    await this.doctorSlotService.updateSlotStatusesByDates(
      canceldto.from,
      canceldto.to,
      allSlots,
      DoctorSlotStatus.UNAVAILABLE,
    );
    for (const slot of bookedSlots) {
      if (slot.appointmentID) {
        const appointment = await this.appointmentModel.findById(
          slot.appointmentID,
        );
        if (
          appointment &&
          ![
            AppointmentStatus.refunded_by_staff,
            AppointmentStatus.cancelled_by_staff,
          ].includes(appointment.status)
        ) {
          if (appointment.status !== AppointmentStatus.pending_payment) {
            const service = await this.serviceService.findOne(
              appointment.serviceID as any,
            );
            const patient = await this.patientService.findOne(
              appointment.patientID as any,
            );
            const transaction =
              await this.paymentsService.createWalletTransaction(
                patient._id as any,
                service.price,
                WalletType.REFUND,
                canceldto.reason,
                appointment._id as any,
              );
            if (!transaction) {
              throw new InternalServerErrorException(
                'Không thể tạo giao dịch hoàn tiền',
              );
            }
            await this.patientService.refundWallet(
              appointment.patientID.toString(),
              service.price,
            );
            refundTotal += service.price;
            await this.appointmentModel.updateOne(
              { _id: appointment._id },
              {
                $set: {
                  status: AppointmentStatus.refunded_by_staff,
                  cancellationReason: canceldto.reason,
                  canceledAt: new Date(),
                  canceledBy: { _id: user._id, email: user.email },
                },
              },
            );

            await this.mailService.sendAppointmentCanceledEmail({
              to: patient.contactEmails?.[0] || 'khoaldse184650@fpt.edu.vn',
              patientName: patient.name || 'No Name',
              appointmentDate: format(appointment.startTime, 'dd/MM/yyyy'),
              reason: canceldto.reason,
              shift: format(appointment.startTime, 'HH:mm'),
              refundAmount: service.price,
            });
          } else {
            // Chỉ huỷ, không hoàn tiền
            await this.appointmentModel.updateOne(
              { _id: appointment._id },
              {
                $set: {
                  status: AppointmentStatus.cancelled_by_staff,
                  cancellationReason: canceldto.reason,
                  canceledAt: new Date(),
                  canceledBy: { _id: user._id, email: user.email },
                },
              },
            );
          }
          countCancelled++;
        }
      }
    }
    await this.doctorScheduleService.markSchedulesAsUnavailableFromList(
      schedules,
    );
    return {
      cancelledSchedules: schedules.length,
      totalSlotsAffected: allSlots.length,
      slotsBooked: bookedSlots.length,
      appointmentsCancelled: countCancelled,
      refundsIssued: refundTotal,
      message: 'Đã huỷ lịch và hoàn tiền (nếu có) thành công.',
    };
  };
  getFromPersonalID = async (personalID: string) => {
    const patient = await this.patientService.findOneByPersonalID(personalID);

    if (!patient) {
      throw new BadRequestException(
        'Không tìm thấy patient bằng userID ở Token',
      );
    }

    return await this.appointmentModel
      .find({
        patientID: patient._id,
        status: AppointmentStatus.confirmed,
      })
      .sort({ date: -1 })
      .populate([
        {
          path: 'serviceID',
          select: 'name price durationMinutes',
        },
        {
          path: 'patientID',
          select: 'name personalID userID',
          populate: { path: 'userID', select: 'name' },
        },
        {
          path: 'doctorID',
          select: 'userID room',
          populate: { path: 'userID', select: 'name' },
        },
      ]);
  };
  async checkinAppointment(id: string, user: IUser) {
    const appointment = await this.appointmentModel.findById({
      _id: id,
      isDeleted: true,
    });
    if (!appointment) {
      throw new BadRequestException('Không tìm thấy lịch hẹn!');
    }

    if (appointment.status !== AppointmentStatus.confirmed) {
      throw new BadRequestException('Lịch hẹn chưa được xác nhận!');
    }
    const updateResult = await this.appointmentModel.updateOne(
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
    const patientI4 = await this.patientService.findOne(
      appointment.patientID as any,
    );
    if (!patientI4) {
      throw new NotFoundException('Không tìm thấy bệnh nhân!');
    }

    return { message: `Bệnh nhân ${patientI4.name} đã đến khám` };
  }
  checkoutAppointment = async (id: string, user: IUser) => {
    const appointment = await this.appointmentModel.findById({
      _id: id,
      isDeleted: true,
    });
    if (!appointment) {
      throw new BadRequestException('Không tìm thấy lịch hẹn!');
    }

    if (appointment.status !== AppointmentStatus.checkin) {
      throw new BadRequestException('Khách hàng chưa check-in!');
    }
    const updateResult = await this.appointmentModel.updateOne(
      { _id: id },
      {
        status: AppointmentStatus.completed,
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
    const patientI4 = await this.patientService.findOne(
      appointment.patientID as any,
    );
    if (!patientI4) {
      throw new NotFoundException('Không tìm thấy bệnh nhân!');
    }

    return { message: `Bệnh nhân ${patientI4.name} đã checkout` };
  }
}
