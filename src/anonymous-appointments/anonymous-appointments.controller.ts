import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnonymousAppointmentsService } from './anonymous-appointments.service';
import { CreateAnonymousAppointmentDto } from './dto/create-anonymous-appointment.dto';
import { UpdateAnonymousAppointmentDto } from './dto/update-anonymous-appointment.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('anonymousAppointments')
@ApiTags('anonymousAppointments')
export class AnonymousAppointmentsController {
  constructor(
    private readonly anonymousAppointmentService: AnonymousAppointmentsService,
  ) {}

  @Post()
  @ResponseMessage('Create a new AnonymousAppointment')
  create(
    @Body() createAnonymousAppointmentDto: CreateAnonymousAppointmentDto,
    @User() user: IUser,
  ) {
    return this.anonymousAppointmentService.create(
      createAnonymousAppointmentDto,
      user,
    );
  }

  @Get()
  findAll() {
    return this.anonymousAppointmentService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.anonymousAppointmentService.findOne(id);
  }

  @Patch(':id')
  @Public()
  update(
    @Param('id') id: string,
    @Body() updateAnonymousAppointmentDto: UpdateAnonymousAppointmentDto,
    @User() user: IUser,
  ) {
    return this.anonymousAppointmentService.update(
      id,
      updateAnonymousAppointmentDto,
      user,
    );
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.anonymousAppointmentService.remove(id, user);
  }
  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Xác nhận lịch hẹn ẩn danh' })
  @ResponseMessage('Confirm An')
  @ResponseMessage('Anonymous appointment confirmed')
  async confirmAnonymousAppointment(
    @Param('id') appointmentId: string,
    @User() user: IUser,
  ) {
    return this.anonymousAppointmentService.confirm(appointmentId, user);
  }
  @Patch(':id/checkin')
  @ApiOperation({ summary: 'Checkin lịch hẹn' })
  @ApiParam({ name: 'id', required: true, description: 'ID lịch hẹn' })
  @ResponseMessage('Checkin hẹn thành công')
  checkinAppointment(@Param('id') id: string, @User() user: IUser) {
    return this.anonymousAppointmentService.checkinAppointment(id, user);
  }
  @Patch(':id/checkout')
  @ApiOperation({ summary: 'Checkout lịch hẹn' })
  @ApiParam({ name: 'id', required: true, description: 'ID lịch hẹn' })
  @ResponseMessage('Checkout hẹn thành công')
  checkoutAppointment(@Param('id') id: string, @User() user: IUser) {
    return this.anonymousAppointmentService.checkoutAppointment(id, user);
  }
}
