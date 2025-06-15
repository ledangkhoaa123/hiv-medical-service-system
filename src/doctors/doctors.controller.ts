import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('doctors')
@ApiTags('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bác sĩ mới' })
  @ResponseMessage('Create a new Doctor')
  create(@Body() createDoctorDto: CreateDoctorDto, @User() user: IUser) {
    return this.doctorsService.create(createDoctorDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bác sĩ' })
  @ResponseMessage('Get all Doctors')
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin bác sĩ theo ID' })
  @ResponseMessage('Get Doctor by ID')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin bác sĩ' })
  @ResponseMessage('Update Doctor by ID')
  update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
    @User() user: IUser,
  ) {
    return this.doctorsService.update(id, updateDoctorDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Vô hiệu hóa bác sĩ theo ID' })
  @ResponseMessage('Delete Doctor by ID')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.doctorsService.remove(id, user);
  }
}
