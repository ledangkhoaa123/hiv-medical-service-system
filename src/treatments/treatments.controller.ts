import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { Treatment } from './schemas/treatment.schema';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  async create(
    @Body() createTreatmentDto: CreateTreatmentDto,
    @User() user: IUser,
  ) {
    return this.treatmentsService.create(createTreatmentDto, user);
  }

  @Get()
  async findAll() {
    return this.treatmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, user: IUser) {
    return this.treatmentsService.findOne(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
    @User() user: IUser,
  ) {
    return this.treatmentsService.update(id, updateTreatmentDto, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, user: IUser) {
    return this.treatmentsService.delete(id, user);
  }
}
