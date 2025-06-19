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
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('prescribedRegiments')
export class PrescribedRegimentsController {
  constructor(
    private readonly prescribedRegimentsService: PrescribedRegimentsService,
  ) {}

  @Post()
  async create(
    @Body() createPrescribedRegimentDto: CreatePrescribedRegimentDto,
    @User() user: IUser,
  ) {
    return this.prescribedRegimentsService.create(
      createPrescribedRegimentDto,
      user,
    );
  }

  @Get()
  async findAll() {
    return this.prescribedRegimentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, user: IUser) {
    return this.prescribedRegimentsService.findOne(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePrescribedRegimentDto: UpdatePrescribedRegimentDto,
    @User() user: IUser,
  ) {
    return this.prescribedRegimentsService.update(
      id,
      updatePrescribedRegimentDto,
      user,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, user: IUser) {
    return this.prescribedRegimentsService.delete(id, user);
  }
}
