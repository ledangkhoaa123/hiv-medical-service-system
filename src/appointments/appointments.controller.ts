import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import {
  AppointmentPersonalIDDto,
  CancelAppointmentDto,
  CancelAppointmentForDoctorDto,
  CancelByDateDto,
  CreateAppointmentDto,
} from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Lịch hẹn')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  @Public()
  @ApiOperation({ summary: 'Tạo lịch hẹn mới' })
  @ResponseMessage('Tạo lịch hẹn mới')
  @Post()
  @ResponseMessage('Create a new appointment')
  create(@Body() createappointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createappointmentDto);
  }
  @ResponseMessage('Xem tất cả lịch hẹn')
  @ApiOperation({ summary: 'Lấy tất cả lịch hẹn' })
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }
  @Public()
  @ApiOperation({ summary: 'Xem lịch hẹn theo khoảng ngày' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Ngày bắt đầu (YYYY-MM-DD)',
    example: '2025-06-20',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'Ngày kết thúc (YYYY-MM-DD)',
    example: '2025-06-25',
  })
  @Get('by-date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.appointmentsService.findByDateRange(startDate, endDate);
  }
  @Public()
  @ApiOperation({ summary: 'Xem lịch hẹn theo bác sĩ và ngày' })
  @ApiParam({ name: 'doctorId', required: true, description: 'ID bác sĩ' })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Ngày (YYYY-MM-DD)',
    example: '2025-06-20',
  })
  @Get('by-doctor/:doctorId')
  findByDoctorAndDate(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.findByDoctorAndDate(doctorId, date);
  }

  @Public()
  @ResponseMessage('Xem chi tiết lịch hẹn theo id')
  @ApiOperation({ summary: 'Lấy chi tiết lịch hẹn theo id' })
  @ApiParam({ name: 'id', required: true, description: 'ID lịch hẹn' })
  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }
  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Xác nhận lịch hẹn' })
  @ApiParam({ name: 'id', required: true, description: 'ID lịch hẹn' })
  @ResponseMessage('Xác nhận lịch hẹn thành công')
  confirmAppointment(@Param('id') id: string, @User() user: IUser) {
    return this.appointmentsService.confirmAppointment(id, user);
  }

  @ResponseMessage('Cập nhật lịch hẹn')
  @ApiOperation({ summary: 'Cập nhật lịch hẹn' })
  @ApiParam({ name: 'id', required: true, description: 'ID lịch hẹn' })
  @ApiBody({ type: UpdateAppointmentDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateappointmentDto: UpdateAppointmentDto,
    @User() user: IUser,
  ) {
    return this.appointmentsService.update(id, updateappointmentDto, user);
  }
  @ResponseMessage('Xóa lịch hẹn')
  @ApiOperation({ summary: 'Xóa lịch hẹn' })
  @ApiParam({ name: 'id', required: true, description: 'ID lịch hẹn' })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.appointmentsService.remove(id, user);
  }
  @ApiOperation({ summary: 'Lấy Appointment theo token' })
  @ResponseMessage('Get Appointment from Access Token')
  @Post('token')
  getAppointByToken(@User() user: IUser) {
    return this.appointmentsService.getFromToken(user);
  }
  @ApiOperation({ summary: 'Lấy Appointment theo patient token' })
  @ResponseMessage('Get Appointment from Access Token')
  @Get('patienttoken')
  getAppointByPatientToken(@User() user: IUser) {
    return this.appointmentsService.getFromTokenPatient(user);
  }
  @ApiOperation({ summary: 'Lấy Appointment theo personalID' })
  @ResponseMessage('Get Appointment from PersonalID')
  @Post('personalID')
  getAppointByPersonalID(@Body() personalIDdto: AppointmentPersonalIDDto) {
    return this.appointmentsService.getFromPersonalID(personalIDdto.personalID);
  }
  @ApiOperation({ summary: 'Hủy lịch hẹn vì bác sĩ bận đột xuất' })
  @ResponseMessage('Cancle appointment for doctor')
  @Post('cancle/doctor')
  cancelAppointmentForDoctor(
    @Body() cancleAppointmentdto: CancelAppointmentForDoctorDto,
    @User() user: IUser,
  ) {
    return this.appointmentsService.cancelAppointmentForDoctor(
      cancleAppointmentdto,
      user,
    );
  }
  @ApiOperation({ summary: 'Hủy lịch hẹn vì lí do khác' })
  @ResponseMessage('Cancle appointment by date')
  @Post('cancle')
  cancelAppointmentForHospital(
    @Body() cancleAppointmentdto: CancelByDateDto,
    @User() user: IUser,
  ) {
    return this.appointmentsService.cancelAppointmentForHospital(
      cancleAppointmentdto,
      user,
    );
  }
  @ApiOperation({ summary: 'Hủy lịch hẹn' })
  @ResponseMessage('Cancle appointment')
  @Post('cancle/appointment')
  cancelAppointment(
    @Body() cancleAppointmentdto: CancelAppointmentDto,
    @User() user: IUser,
  ) {
    return this.appointmentsService.cancelAppointment(
      cancleAppointmentdto,
      user,
    );
  }
  @Patch(':id/checkin')
  @ApiOperation({ summary: 'Checkin lịch hẹn' })
  @ApiParam({ name: 'id', required: true, description: 'ID lịch hẹn' })
  @ResponseMessage('Checkin hẹn thành công')
  checkinAppointment(@Param('id') id: string, @User() user: IUser) {
    return this.appointmentsService.checkinAppointment(id, user);
  }
}
