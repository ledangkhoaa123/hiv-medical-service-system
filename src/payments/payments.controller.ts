import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request, Response } from 'express';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { CreatePaymentDto, CreateWalletPaymentDto } from './dto/create-payment';
import { IUser } from 'src/users/user.interface';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('vnpay-url')
  @ApiOperation({ summary: 'Lấy URL thanh toán' })
  @ApiBody({ type: CreatePaymentDto })
  @ResponseMessage('Get URL for Payment')
  @Public()
  async createPaymentUrl(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const ip = req.ip;
    const url = await this.paymentsService.createPaymentUrl(
      createPaymentDto.appointmentID,
      ip,
    );
    return { paymentUrl: url };
  }

  @Post('wallet')
  @ApiOperation({ summary: 'Lấy URL thanh toán' })
  @ApiBody({ type: CreatePaymentDto })
  @ResponseMessage('Get URL for Payment')
  async createWalletPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @User() user: IUser,
  ) {
    const url = await this.paymentsService.payByWallet(
      createPaymentDto.appointmentID,
      user,
    );
    return url;
  }

  @Post('fund-wallet')
  @ApiOperation({ summary: 'Nạp tiền vào ví' })
  @ApiBody({ type: CreateWalletPaymentDto })
  @ResponseMessage('Deposit money into wallet')
  async depositWallet(
    @Body() createWalletPaymentDto: CreateWalletPaymentDto,
    @User() user: IUser,
    @Req() req: Request,
  ) {
    const url = await this.paymentsService.depositWallet(
      createWalletPaymentDto.amount,
      user,
      req.ip,
    );
    return url;
  }

  @Get('vnpay-return')
  @Public()
  async handleReturn(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentsService.verifyReturn(query);
    const success = result.vnp_ResponseCode === '00';
    const isApp = result.vnp_TxnRef.startsWith('APPT_');
    let redirectUrl;
    if (success) {  
      if (isApp) {
        redirectUrl =new URL('http://localhost:5173/payments/vnpay-return');
      }else{
        redirectUrl =new URL('http://localhost:5173/up-wallet-success');
      }
    } else {
      redirectUrl = new URL('http://localhost:5173/payments/cancel');
    }

    // Append original query params back to FE URL
    Object.keys(query).forEach((key) => {
      redirectUrl.searchParams.append(key, query[key]);
    });

    return res.redirect(redirectUrl.toString());
  }

  @Get('vnpay-ipn')
  @Public()
  async handleIpn(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentsService.verifyIpn(query);
    return res.json(result);
  }
  @Get('patient-transactions')
  async getPatientTransactions(@User() user: IUser) {
    const result = await this.paymentsService.getPatientTransactions(user);
    return result;
  }
}
