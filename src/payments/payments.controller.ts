import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request, Response } from 'express';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { CreatePaymentDto } from './dto/create-payment';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('vnpay-url')
  @ApiOperation({summary: 'Lấy URL thanh toán'})
  @ApiBody({ type: CreatePaymentDto, })
  @ResponseMessage("Get URL for Payment")
  @Public()
  async createPaymentUrl(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    const ip = req.ip;
    const url = await this.paymentsService.createPaymentUrl(createPaymentDto.appointmentID, ip);
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
