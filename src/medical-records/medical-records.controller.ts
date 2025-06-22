import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecord } from './schemas/medical-record.schema';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('medical-records')
@Controller('medicalrecords')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hồ sơ bệnh án mới' })
  @ResponseMessage("Create a new medical record")
  async create(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
    @User() user: IUser
  ) {
    return this.medicalRecordsService.create(createMedicalRecordDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách hồ sơ bệnh án' })
  @ResponseMessage("Get all medical records")
  async findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy hồ sơ bệnh án theo ID' })
  @ResponseMessage("Get medical record by ID")
  async findOne(@Param('id') id: string): Promise<MedicalRecord> {
    return this.medicalRecordsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật hồ sơ bệnh án theo ID' })
  @ResponseMessage("Update medical record by ID")
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
    @User() user: IUser
  ) {
    return this.medicalRecordsService.update(id, updateMedicalRecordDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hồ sơ bệnh án theo ID' })
  @ResponseMessage("Delete medical record by ID")
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.medicalRecordsService.remove(id, user);
  }
}