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
import { ArvRegimentsService } from './arv_regiments.service';
import { CreateArvRegimentDto } from './dto/create-arv_regiment.dto';
import { UpdateArvRegimentDto } from './dto/update-arv_regiment.dto';
import { ArvRegiment } from './schemas/arv_regiment.schema';
<<<<<<< HEAD
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
=======
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598

@ApiTags('ARV Regiments')
@Controller('regiments')
export class ArvRegimentsController {
  constructor(private readonly arvRegimentsService: ArvRegimentsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ARV Regiment mới' })
  @ResponseMessage("Create a new ARV Regiment")
  async create(
    @Body() createArvRegimentDto: CreateArvRegimentDto,
<<<<<<< HEAD
    @User() user: IUser,
=======
    @User() user: IUser, // Assuming User decorator returns user info
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  ) {
    return this.arvRegimentsService.create(createArvRegimentDto, user);
  }

  @Get()
<<<<<<< HEAD
=======
  @ApiOperation({ summary: 'Lấy danh sách ARV Regiments' })
  @ResponseMessage("Get all ARV Regiments")
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  async findAll() {
    return this.arvRegimentsService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
  async findOne(@Param('id') id: string, user: IUser) {
    return this.arvRegimentsService.findOne(id, user);
=======
  @ApiOperation({ summary: 'Lấy thông tin ARV Regiment theo ID' })
  @ResponseMessage("Get ARV Regiment by ID")
  async findOne(@Param('id') id: string) {
    return this.arvRegimentsService.findOne(id);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin ARV Regiment theo ID' })
  @ResponseMessage("Update ARV Regiment by ID")
  async update(
    @Param('id') id: string,
    @Body() updateArvRegimentDto: UpdateArvRegimentDto,
    @User() user: IUser,
  ) {
    return this.arvRegimentsService.update(id, updateArvRegimentDto, user);
  }

  @Delete(':id')
<<<<<<< HEAD
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.arvRegimentsService.delete(id, user);
=======
  @ApiOperation({ summary: 'Xóa ARV Regiment theo ID' })
  @ResponseMessage("Delete ARV Regiment by ID")
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.arvRegimentsService.remove(id, user);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }
}
