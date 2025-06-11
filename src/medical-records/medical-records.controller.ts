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

@Controller('medicalrecords')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  async create(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MedicalRecord> {
    return this.medicalRecordsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    return this.medicalRecordsService.update(id, updateMedicalRecordDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.medicalRecordsService.delete(id);
  }
}
