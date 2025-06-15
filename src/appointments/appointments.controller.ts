import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { pick } from 'lodash';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }
  @Public()
  @Post()
  @ResponseMessage("Create a new appointment")
  create(@Body() createappointmentDto: CreateAppointmentDto, @User() user: IUser) {
    return this.appointmentsService.create(createappointmentDto, user);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateappointmentDto: UpdateAppointmentDto, @User() user: IUser) {
    return this.appointmentsService.update(id, updateappointmentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.appointmentsService.remove(id, user);
  }
}
