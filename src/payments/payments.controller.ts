import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request, Response } from 'express';
import { Public, ResponseMessage } from 'src/decorator/customize';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('vnpay-url')
  @ApiOperation({summary: 'Lấy URL thanh toán'})
  @ResponseMessage("Get URL for Payment")
  @Public()
  async createPaymentUrl(@Body('appointmentId') appointmentId: string, @Req() req: Request) {
    const ip = req.ip;
    const url = await this.paymentsService.createPaymentUrl(appointmentId, ip);
    return { paymentUrl: url };
  }

  @Get('vnpay-return')
  @Public()
  async handleReturn(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentsService.verifyReturn(query);
    const success = result.vnp_ResponseCode === '00';

  return res.render('result', { result, success });
  }

  @Get('vnpay-ipn')
  @Public()
  async handleIpn(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentsService.verifyIpn(query);
    return res.json(result);
  }
}
