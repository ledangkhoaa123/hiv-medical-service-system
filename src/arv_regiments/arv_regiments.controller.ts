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
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('arv-regiments')
export class ArvRegimentsController {
  constructor(private readonly arvRegimentsService: ArvRegimentsService) {}

  @Post()
  async create(
    @Body() createArvRegimentDto: CreateArvRegimentDto,
    @User() user: IUser,
  ) {
    return this.arvRegimentsService.create(createArvRegimentDto, user);
  }

  @Get()
  async findAll() {
    return this.arvRegimentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, user: IUser) {
    return this.arvRegimentsService.findOne(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArvRegimentDto: UpdateArvRegimentDto,
    @User() user: IUser,
  ) {
    return this.arvRegimentsService.update(id, updateArvRegimentDto, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.arvRegimentsService.delete(id, user);
  }
}
