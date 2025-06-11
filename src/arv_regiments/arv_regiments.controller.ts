import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ArvRegimentsService } from './arv_regiments.service';
import { CreateArvRegimentDto } from './dto/create-arv_regiment.dto';
import { UpdateArvRegimentDto } from './dto/update-arv_regiment.dto';
import { ArvRegiment } from './schemas/arv_regiment.schema';

@Controller('arv-regiments')
export class ArvRegimentsController {
  constructor(private readonly arvRegimentsService: ArvRegimentsService) {}

  @Post()
  async create(
    @Body() createArvRegimentDto: CreateArvRegimentDto,
  ): Promise<ArvRegiment> {
    return this.arvRegimentsService.create(createArvRegimentDto);
  }

  @Get()
  async findAll(): Promise<ArvRegiment[]> {
    return this.arvRegimentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ArvRegiment> {
    return this.arvRegimentsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArvRegimentDto: UpdateArvRegimentDto,
  ): Promise<ArvRegiment> {
    return this.arvRegimentsService.update(id, updateArvRegimentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.arvRegimentsService.delete(id);
  }
}
