import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, BadRequestException } from '@nestjs/common';
import { DoctorSlotsService } from './doctor_slots.service';
import { CreateDoctorSlotDto } from './dto/create-doctor_slot.dto';
import { UpdateDoctorSlotDto } from './dto/update-doctor_slot.dto';
import { IUser } from 'src/users/user.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
@ApiTags('Ca làm việc của bác sĩ')
@Controller('doctorSlots')
export class DoctorSlotsController {
  constructor(private readonly doctorSlotsService: DoctorSlotsService) { }
  @ApiOperation({ summary: 'Tạo ca làm việc cho bác sĩ' })
  @ResponseMessage('Tạo ca làm việc thành công')
  @Post()
  create(@Body() createDoctorSlotDto: CreateDoctorSlotDto, @User() user: IUser) {
    return this.doctorSlotsService.create(createDoctorSlotDto, user);
  }
  @ApiOperation({ summary: 'Lấy tất cả ca làm việc' })
  @ResponseMessage('Lấy tất cả ca làm việc thành công')
  @Get()
  @Public()
  findAll() {
    return this.doctorSlotsService.findAll();
  }
  @Public()
  @ApiOperation({ summary: 'Tìm slot khả dụng theo dịch vụ, bác sĩ và ngày' })
  @ApiParam({ name: 'doctorId', required: true, description: 'ID bác sĩ' })
  @ApiQuery({ name: 'serviceId', required: true, description: 'ID dịch vụ' })
  @ApiQuery({ name: 'date', required: true, description: 'Ngày (YYYY-MM-DD)', example: '2025-06-20' })
  @Get(':doctorId/available-slots')
  async findSlotByService(
    @Param('doctorId') doctorId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: Date
  ) {
    if (!doctorId || !serviceId || !date) {
      throw new BadRequestException('Thiếu tham số doctorId, serviceId hoặc date');
    }
    // Chuyển date về kiểu Date
    return this.doctorSlotsService.findSlotByService(serviceId, doctorId, date);
  }

  @ApiOperation({ summary: 'Xem tất cả bác sĩ theo Slot' })
  @ApiQuery({ name: 'date', required: true, type: String, example: '2025-06-20' })
  @ApiQuery({ name: 'startTime', required: true, type: String, example: '08:00' })
  @ApiQuery({ name: 'endTime', required: true, type: String, example: '08:30' })
  @ResponseMessage('Xem tất cả bác sĩ theo slot')
  @Public()
  @Get('/doctors-by-slot')
  async findDoctorsBySlot(
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string
  ) {
    return this.doctorSlotsService.findDoctorsBySlots(date, startTime, endTime);
  }

  @ApiOperation({ summary: 'Xem thông tin slot khám' })
  @ResponseMessage('Xem thông tin slot khám')
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.doctorSlotsService.findOne(id);
  }

  @ApiOperation({ summary: 'Xem tất cả slot khám của bác sĩ theo ngày' })
  @ApiParam({ name: 'doctorId', required: true, type: String })
  @ApiQuery({ name: 'date', required: true, type: String, example: '2025-06-20' })
  @ResponseMessage('Xem tất cả Slot khám của bác sĩ theo ngày')
  @Get(':doctorId/slots-by-date')
  @Public()
  async findSlotsByDate(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string
  ) {
    return this.doctorSlotsService.findByDoctorAndDate(doctorId, date);
  }
  @ApiOperation({ summary: 'Cập nhật ca làm việc' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateDoctorSlotDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorSlotDto: UpdateDoctorSlotDto, @User() user: IUser) {
    return this.doctorSlotsService.update(id, updateDoctorSlotDto, user);
  }
  @ApiOperation({ summary: 'Xóa ca làm việc' })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.doctorSlotsService.remove(id, user);
  }
}
