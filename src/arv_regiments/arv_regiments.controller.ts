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
<<<<<<< HEAD
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
=======
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf

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
<<<<<<< HEAD
    @User() user: IUser,
=======
    @User() user: IUser, // Assuming User decorator returns user info
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
    @User() user: IUser, // Assuming User decorator returns user info
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  ) {
    return this.arvRegimentsService.create(createArvRegimentDto, user);
  }

  @Get()
<<<<<<< HEAD
<<<<<<< HEAD
=======
  @ApiOperation({ summary: 'Lấy danh sách ARV Regiments' })
  @ResponseMessage("Get all ARV Regiments")
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
  @ApiOperation({ summary: 'Lấy danh sách ARV Regiments' })
  @ResponseMessage("Get all ARV Regiments")
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async findAll() {
    return this.arvRegimentsService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
<<<<<<< HEAD
  async findOne(@Param('id') id: string, user: IUser) {
    return this.arvRegimentsService.findOne(id, user);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
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
<<<<<<< HEAD
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.arvRegimentsService.delete(id, user);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  @ApiOperation({ summary: 'Xóa ARV Regiment theo ID' })
  @ResponseMessage("Delete ARV Regiment by ID")
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.arvRegimentsService.remove(id, user);
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  }
}
