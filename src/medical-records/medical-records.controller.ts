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
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { use } from 'passport';

@Controller('medicalRecords')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  async create(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
    @User() user: IUser,
  ) {
    return this.medicalRecordsService.create(createMedicalRecordDto, user);
  }

  @Get()
  async findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicalRecordsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
    @User() user: IUser,
  ) {
    return this.medicalRecordsService.update(id, updateMedicalRecordDto, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, user: IUser) {
    return this.medicalRecordsService.delete(id, user);
  }
}
