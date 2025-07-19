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
import { ConfigService } from '@nestjs/config';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private configService: ConfigService
  ) {}

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
  @ApiOperation({ summary: 'Thanh toán bằng ví' })
  @ApiBody({ type: CreatePaymentDto })
  @ResponseMessage('Pay by Wallet')
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
    const feUrl = this.configService.get<string>('FE_URL'); // lấy FE_URL từ .env
    let redirectUrl: URL;

    if (success) {
      if (isApp) {
        redirectUrl = new URL(`${feUrl}/payments/vnpay-return`);
        query.vnp_TxnRef = query.vnp_TxnRef.replace('APPT_', '');
      } else {
        redirectUrl = new URL(`${feUrl}/up-wallet-success`);
        query.vnp_TxnRef = query.vnp_TxnRef.replace('WALLET_', '');
      }
    } else {
      redirectUrl = new URL(`${feUrl}/payments/cancel`);
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
