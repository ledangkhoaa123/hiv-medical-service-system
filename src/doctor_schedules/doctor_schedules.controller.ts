import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorSchedulesService } from './doctor_schedules.service';
import { CreateDoctorScheduleDto } from './dto/create-doctor_schedule.dto';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('doctor-schedules')
export class DoctorSchedulesController {
  constructor(private readonly doctorSchedulesService: DoctorSchedulesService) { }

  @ResponseMessage('Gửi lịch khám thành công')
  @Post()
  create(@Body() createDoctorScheduleDto: CreateDoctorScheduleDto, @User() user: IUser) {
    return this.doctorSchedulesService.createSchedule(createDoctorScheduleDto, user);
  }

  @Get()
  findAll() {
    return this.doctorSchedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorSchedulesService.findOne(id);
  }
  @Patch(':id/confirm')
  confirmSlots(@Param('id') scheduleId: string, @User() user: IUser) {
    return this.doctorSchedulesService.confirmSlots(scheduleId, user);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto, @User() user: IUser) {
    return this.doctorSchedulesService.update(id, updateDoctorScheduleDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorSchedulesService.remove(id);
  }
}
