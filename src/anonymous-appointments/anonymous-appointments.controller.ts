import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnonymousAppointmentsService } from './anonymous-appointments.service';
import { CreateAnonymousAppointmentDto } from './dto/create-anonymous-appointment.dto';
import { UpdateAnonymousAppointmentDto } from './dto/update-anonymous-appointment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';


@Controller('anonymousAppointments')
@ApiTags("anonymousAppointments")
export class AnonymousAppointmentsController {
  constructor(private readonly AnonymousAppointmentsService: AnonymousAppointmentsService) { }
  @Public()
  @Post()
  @ResponseMessage("Create a new AnonymousAppointment")
  create(@Body() createAnonymousAppointmentDto: CreateAnonymousAppointmentDto, @User() user: IUser) {
    return this.AnonymousAppointmentsService.create(createAnonymousAppointmentDto, user);
  }

  @Get()
  @Public()
  findAll() {
    return this.AnonymousAppointmentsService.findAll();
  }


  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.AnonymousAppointmentsService.findOne(id);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateAnonymousAppointmentDto: UpdateAnonymousAppointmentDto, @User() user: IUser) {
    return this.AnonymousAppointmentsService.update(id, updateAnonymousAppointmentDto, user);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.AnonymousAppointmentsService.remove(id, user);
  }
}
