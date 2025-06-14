import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { PrescribedRegimentsService } from './prescribed_regiments.service';
import { CreatePrescribedRegimentDto, SuggestRegimentDto } from './dto/create-prescribed_regiment.dto';
import { UpdatePrescribedRegimentDto } from './dto/update-prescribed_regiment.dto';
import { PrescribedRegiment } from './schemas/prescribed_regiment.schema';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@ApiTags('Phác đồ cá nhân')
@Controller('prescribedRegiments')
export class PrescribedRegimentsController {
  constructor(
    private readonly prescribedRegimentsService: PrescribedRegimentsService,
  ) {}

  @Post()
  async create(
    @Body() createPrescribedRegimentDto: CreatePrescribedRegimentDto,
    @User() user: IUser
  ) {
    return this.prescribedRegimentsService.create(createPrescribedRegimentDto, user);
  }

  @Get()
  async findAll() {
    return this.prescribedRegimentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prescribedRegimentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePrescribedRegimentDto: UpdatePrescribedRegimentDto,
    @User() user: IUser
  ) {
    return this.prescribedRegimentsService.update(
      id,
      updatePrescribedRegimentDto,
      user
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.prescribedRegimentsService.remove(id, user);
  }

  @Post('suggest')
  async suggestRegiment(@Body() dto: SuggestRegimentDto) {
  return this.prescribedRegimentsService.suggestRegiment(dto.testResults);
}
}
