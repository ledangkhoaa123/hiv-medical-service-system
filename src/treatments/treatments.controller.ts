import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { Treatment } from './schemas/treatment.schema';

@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  async create(@Body() createTreatmentDto: CreateTreatmentDto): Promise<Treatment> {
    return this.treatmentsService.create(createTreatmentDto);
  }

  @Get()
  async findAll(): Promise<Treatment[]> {
    return this.treatmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Treatment> {
    return this.treatmentsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
  ): Promise<Treatment> {
    return this.treatmentsService.update(id, updateTreatmentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.treatmentsService.delete(id);
  }
}