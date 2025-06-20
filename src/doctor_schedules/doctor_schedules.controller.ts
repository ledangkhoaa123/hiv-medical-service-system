import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DoctorSchedulesService } from './doctor_schedules.service';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { IUser } from 'src/users/user.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import {  ConfirmSlotQueryDto, CreateDoctorScheduleDto, CreateMultiScheduleDto, ScheduleWeekBodyDto } from './dto/create-doctor_schedule.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppointmentShiftName } from 'src/enums/all_enums';
@ApiTags('Lịch làm việc của bác sĩ')
@Controller('doctor-schedules')
export class DoctorSchedulesController {
  constructor(private readonly doctorSchedulesService: DoctorSchedulesService) { }
  @ApiOperation({ summary: 'Tạo lịch làm cho Doctor' })
  @ResponseMessage('Gửi lịch khám thành công')
  @Post()
  create(@Body() dto: CreateMultiScheduleDto,
    @User() user: IUser
  ) {
    return this.doctorSchedulesService.createSchedule(dto, user);
  }
  @Public()
  @Get()
  findAll() {
    return this.doctorSchedulesService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorSchedulesService.findOne(id);
  }
  @Public()
  @ApiOperation({ summary: 'Xem lịch làm theo tuần (có thể ngày hoặc tháng)' })
  @ResponseMessage('Xem lịch khám thành công')
  @Get(':doctorId/schedule-by-week')
  findSlotsByWeek(
    @Param('doctorId') doctorId: string,
    @Query() query: ScheduleWeekBodyDto
  ) {
    return this.doctorSchedulesService.getSchedule(doctorId, query.startDate, query.endDate);
  }
  @ApiOperation({ summary: 'Xác nhận lịch làm(theo từng ngày)' })
  @Patch(':id/confirm')
  confirmSlots(
    @Param('id') scheduleId: string,
    @User() user: IUser,
    @Query() query: ConfirmSlotQueryDto
  ) {
    return this.doctorSchedulesService.confirmSlots(scheduleId, user, query.shiftName);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto, @User() user: IUser) {
    return this.doctorSchedulesService.update(id, updateDoctorScheduleDto, user);
  }
  @ApiOperation({ summary: 'Xóa lịch khám theo ngày' })
  @ResponseMessage('Xóa lịch khám theo thành công')
  @Delete(':id')
  remove(@Param('id') id: string,@User() user: IUser) {
    return this.doctorSchedulesService.remove(id, user);
  }
}
