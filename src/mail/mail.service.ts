import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { verify } from 'crypto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendAnonymousAppointmentCreatedEmail(data: {
    to: string;
    patientName: string;
    appointmentDate: string;
    shift: string;
    doctorName: string;
    meetingLink: string;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Xác nhận lịch hẹn tư vấn ẩn danh của bạn',
      template: 'AnnAppointment',
      context: {
        patientName: data.patientName,
        appointmentDate: data.appointmentDate,
        shift: data.shift,
        doctorName: data.doctorName,
        meetingLink: data.meetingLink,
      },
    });
  }

  async sendAppointmentCreatedEmail(data: {
    to: string;
    patientName: string;
    appointmentDate: string;
    shift: string;
    status: string;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Lịch hẹn của bạn',
      template: 'createAppointment',
      context: {
        patientName: data.patientName,
        appointmentDate: data.appointmentDate,
        shift: data.shift,
        status: data.status,
      },
    });
  }

  async sendFollowUpReminderEmail(data: {
    to: string;
    patientName: string;
    doctorName: string;
    room: string;
    followUpDate: string;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Nhắc lịch tái khám',
      template: 'followUp',
      context: {
        patientName: data.patientName,
        followUpDate: data.followUpDate,
        doctorName: data.doctorName,
        room: data.room,
      },
    });
  }
  async sendVerifyEmail(data: { to: string; verifyLink: string }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Xác thực tài khoản email',
      template: 'verifyEmail',
      context: {
        verifyLink: data.verifyLink,
      },
    });
  }
  async sendResetPasswordEmail(data: { to: string; resetLink: string }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Đặt lại mật khẩu',
      template: 'resetPassword',
      context: { resetLink: data.resetLink },
    });
  }

  async sendAppointmentCanceledEmail(data: {
    to: string;
    patientName: string;
    appointmentDate: string;
    shift: string;
    refundAmount?: number; // có hoặc không
    reason: string;
  }) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Thông báo huỷ lịch hẹn',
      template: 'cancelAppointment', // bạn sẽ cần template tương ứng
      context: {
        patientName: data.patientName,
        appointmentDate: data.appointmentDate,
        shift: data.shift,
        refundAmount: data.refundAmount,
        reason: data.reason,
      },
    });
  }
}
