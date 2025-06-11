import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PrescribedRegimentsService } from './prescribed_regiments.service';
import { CreatePrescribedRegimentDto } from './dto/create-prescribed_regiment.dto';
import { UpdatePrescribedRegimentDto } from './dto/update-prescribed_regiment.dto';
import { PrescribedRegiment } from './schemas/prescribed_regiment.schema';

@Controller('prescribedRegiments')
export class PrescribedRegimentsController {
  constructor(
    private readonly prescribedRegimentsService: PrescribedRegimentsService,
  ) {}

  @Post()
  async create(
    @Body() createPrescribedRegimentDto: CreatePrescribedRegimentDto,
  ): Promise<PrescribedRegiment> {
    return this.prescribedRegimentsService.create(createPrescribedRegimentDto);
  }

  @Get()
  async findAll(): Promise<PrescribedRegiment[]> {
    return this.prescribedRegimentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PrescribedRegiment> {
    return this.prescribedRegimentsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePrescribedRegimentDto: UpdatePrescribedRegimentDto,
  ): Promise<PrescribedRegiment> {
    return this.prescribedRegimentsService.update(
      id,
      updatePrescribedRegimentDto,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.prescribedRegimentsService.delete(id);
  }
}
