import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DoctorSchedulesService } from './doctor_schedules.service';
import { UpdateDoctorScheduleDto } from './dto/update-doctor_schedule.dto';
import { IUser } from 'src/users/user.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { CreateDoctorScheduleDto, CreateMultiScheduleDto, ScheduleWeekBodyDto } from './dto/create-doctor_schedule.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Xem lịch khám theo ngày(có thể tuần hoặc tháng)' })
  @ResponseMessage('Xem lịch khám thành công')
  @Post(':doctorId/schedule-by-week')
  findSlotsByWeek(
    @Param('doctorId') doctorId: string,
    @Body() body: ScheduleWeekBodyDto
  ) {
    return this.doctorSchedulesService.getSchedule(doctorId, body.startDate, body.endDate);
  }
  @ApiOperation({ summary: 'Xác nhận lịch làm(theo từng ngày)' })
  // @ResponseMessage('Xác nhận lịch làm thành công')
  @Patch(':id/confirm')
  confirmSlots(@Param('id') scheduleId: string, @User() user: IUser) {
    return this.doctorSchedulesService.confirmSlots(scheduleId, user);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto, @User() user: IUser) {
    return this.doctorSchedulesService.update(id, updateDoctorScheduleDto, user);
  }
  @ApiOperation({ summary: 'Xóa lịch khám theo ngày' })
  @ResponseMessage('Xóa lịch khám theo thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorSchedulesService.remove(id);
  }
}
