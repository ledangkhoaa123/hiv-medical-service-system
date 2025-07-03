import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  BuildPaymentUrl,
  InpOrderAlreadyConfirmed,
  IpnFailChecksum,
  IpnInvalidAmount,
  IpnOrderNotFound,
  IpnSuccess,
  IpnUnknownError,
  parseDate,
  VerifyIpnCall,
  VerifyReturnUrl,
  VNPay,
} from 'vnpay';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { AppointmentStatus, WalletType } from 'src/enums/all_enums';
import { ServicesService } from 'src/services/services.service';
import { ConfigService } from '@nestjs/config';
import { PatientsService } from 'src/patients/patients.service';
import {
  WalletTransaction,
  WalletTransactionDocument,
} from './schemas/walletTransaction.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class PaymentsService {
  private vnpay: VNPay;

  constructor(
    @InjectModel(WalletTransaction.name)
    private walletTransactionModel: SoftDeleteModel<WalletTransactionDocument>,
    private readonly appointmentsService: AppointmentsService,
    private readonly servicesService: ServicesService,
    private readonly patientsService: PatientsService,
    private configService: ConfigService,
  ) {
    if (!process.env.VNPAY_SECURE_SECRET || !process.env.VNPAY_TMN_CODE) {
      throw new Error('Missing VNPAY_SECURE_SECRET or VNPAY_TMN_CODE');
    }

    this.vnpay = new VNPay({
      secureSecret: configService.get<string>('VNPAY_SECURE_SECRET'),
      tmnCode: configService.get<string>('VNPAY_TMN_CODE'),
    });
  }

  async createPaymentUrl(appointmentId: string, ip: string): Promise<string> {
    const appointment = await this.appointmentsService.findOne(appointmentId);
    if (!appointment) throw new BadRequestException('Appointment not found');
    
    if (
      appointment.paymentExpireAt &&
      new Date() > appointment.paymentExpireAt
    ) {
      throw new BadRequestException('Lịch hẹn đã quá hạn thanh toán');
    }
    const service = await this.servicesService.findOne(
      appointment.serviceID as any,
    );
    if (appointment.status !== AppointmentStatus.pending_payment)
      throw new BadRequestException('Appointment is not pending payment');
    // Ví dụ: lấy giá dịch vụ
    const amount = service.price; // Hoặc lấy từ appointment.service.price

    const data: BuildPaymentUrl = {
      vnp_Amount: amount,
      vnp_IpAddr: ip,
      vnp_OrderInfo: `Thanh toan lich kham ${appointmentId}`,
      vnp_ReturnUrl: this.configService.get<string>('VNPAY_RETURN_URL'),
      vnp_TxnRef: appointmentId, // Dùng appointmentId làm txnRef
    };

    return this.vnpay.buildPaymentUrl(data);
  }

  async payByWallet(appointmentId: string, user: IUser) {
    const customer = await this.patientsService.findOneByToken(user)
    const appointment = await this.appointmentsService.findOne(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Không tìm thấy appointment');
    }
    const patient = await this.patientsService.findOne(
      appointment.patientID as any,
    );
    if (!patient) {
      throw new NotFoundException('Không tìm thấy patient');
    }
    if (patient.id != customer.id) {
      throw new UnauthorizedException('Bạn không có quyền thanh toán cho appointment này')
    }
    const service = await this.servicesService.findOne(
      appointment.serviceID as any,
    );
    if (!service) {
      throw new NotFoundException('Không tìm thấy service');
    }
    if (
      appointment.paymentExpireAt &&
      new Date() > appointment.paymentExpireAt
    ) {
      throw new BadRequestException('Lịch hẹn đã quá hạn thanh toán');
    }
    await this.patientsService.updateMinorWallet(
      patient._id as any,
      service.price,
    );
    await this.appointmentsService.updateStatus(appointmentId, AppointmentStatus.pending)
    return await this.walletTransactionModel.create({
      patientID: patient._id,
      amount: service.price,
      type: WalletType.PAYMENT,
      reason: 'Thanh toán lịch hẹn',
      referenceAppointmentID: appointmentId,
    });
  }

  async verifyReturn(query: any) {
    const result = this.vnpay.verifyReturnUrl(query as VerifyReturnUrl);
    if (result.isVerified) {
      const appointment = await this.appointmentsService.findOne(
        result.vnp_TxnRef,
      );
      if (appointment) {
        const service = await this.servicesService.findOne(
          appointment.serviceID as any,
        );
        if (service) {
          if (result.vnp_Amount == service.price) {
            if (appointment.status !== AppointmentStatus.pending) {
              await this.appointmentsService.updateStatus(
                appointment._id as any,
                AppointmentStatus.pending,
              );
            }
          }
        }
      }
    }
    return {
      ...result,
      vnp_PayDate: parseDate(
        result.vnp_PayDate ?? 'Invalid Date',
      ).toLocaleString(),
    };
  }

  async verifyIpn(query: any) {
    try {
      const verify: VerifyReturnUrl = this.vnpay.verifyIpnCall(
        query as VerifyIpnCall,
      );
      if (!verify.isVerified) return IpnFailChecksum;

      const appointment = await this.appointmentsService.findOne(
        verify.vnp_TxnRef,
      );
      if (!appointment) return IpnOrderNotFound;

      const service = await this.servicesService.findOne(
        appointment.serviceID as any,
      );
      if (!service) throw new BadRequestException('Service not found');
      if (verify.vnp_Amount !== service.price) return IpnInvalidAmount;

      if (appointment.status === AppointmentStatus.confirmed)
        return InpOrderAlreadyConfirmed;

      // Update status
      await this.appointmentsService.updateStatus(
        appointment._id as any,
        AppointmentStatus.confirmed,
      );

      return IpnSuccess;
    } catch (err) {
      console.error('IPN verify error:', err);
      return IpnUnknownError;
    }
  }
}
