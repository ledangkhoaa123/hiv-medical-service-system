import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private readonly mailerService: MailerService
  ) {
  }
  @Public()
  @Get('test-email')
  async testEmail() {
    await this.mailService.sendFollowUpReminderEmail({
      to: 'thaiquocle1909200400@gmail.com',
      patientName: 'Thai dz',
      doctorName: 'CC',
      room: '555',
      followUpDate: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    });
    return 'Email test đã được gửi!';
  }
}
