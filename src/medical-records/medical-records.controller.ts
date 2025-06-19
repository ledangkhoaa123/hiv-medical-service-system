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
<<<<<<< HEAD
<<<<<<< HEAD
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { use } from 'passport';

@Controller('medicalRecords')
=======
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

=======
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
@ApiTags('medical-records')
@Controller('medicalrecords')
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hồ sơ bệnh án mới' })
  @ResponseMessage("Create a new medical record")
  async create(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
<<<<<<< HEAD
<<<<<<< HEAD
    @User() user: IUser,
=======
    @User() user: IUser
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
    @User() user: IUser
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  ) {
    return this.medicalRecordsService.create(createMedicalRecordDto, user);
  }

  @Get()
<<<<<<< HEAD
<<<<<<< HEAD
=======
  @ApiOperation({ summary: 'Lấy danh sách hồ sơ bệnh án' })
  @ResponseMessage("Get all medical records")
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
  @ApiOperation({ summary: 'Lấy danh sách hồ sơ bệnh án' })
  @ResponseMessage("Get all medical records")
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
<<<<<<< HEAD
  async findOne(@Param('id') id: string) {
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  @ApiOperation({ summary: 'Lấy hồ sơ bệnh án theo ID' })
  @ResponseMessage("Get medical record by ID")
  async findOne(@Param('id') id: string): Promise<MedicalRecord> {
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
    return this.medicalRecordsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật hồ sơ bệnh án theo ID' })
  @ResponseMessage("Update medical record by ID")
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
<<<<<<< HEAD
<<<<<<< HEAD
    @User() user: IUser,
=======
    @User() user: IUser
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
    @User() user: IUser
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  ) {
    return this.medicalRecordsService.update(id, updateMedicalRecordDto, user);
  }

  @Delete(':id')
<<<<<<< HEAD
<<<<<<< HEAD
  async delete(@Param('id') id: string, user: IUser) {
    return this.medicalRecordsService.delete(id, user);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  @ApiOperation({ summary: 'Xóa hồ sơ bệnh án theo ID' })
  @ResponseMessage("Delete medical record by ID")
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.medicalRecordsService.remove(id, user);
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  }
}
