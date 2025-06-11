import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('payments')
export class PaymentsController {
   constructor(private readonly paymentsService: PaymentsService) { }
    @Public()
    @ResponseMessage('Create a payment')
    @Post()
    create(@Body() createpaymentDto: CreatePaymentDto,@User() user:IUser) {
      return this.paymentsService.create(createpaymentDto,user);
    }
    @Public()
    @Get()
    findAll() {
      return this.paymentsService.findAll();
    }
    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.paymentsService.findOne(id);
    }
    @Public()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatepaymentDto: UpdatePaymentDto, user: IUser) {
      return this.paymentsService.update(id, updatepaymentDto, user);
    }
    @Public()
    @Delete(':id')
    remove(@Param('id') id: string,user: IUser) {
      return this.paymentsService.remove(id,user);
    }
}
