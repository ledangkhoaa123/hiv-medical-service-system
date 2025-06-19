import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
<<<<<<< HEAD
<<<<<<< HEAD
=======
  Patch,
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
  Patch,
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
} from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
<<<<<<< HEAD
<<<<<<< HEAD
import { Treatment } from './schemas/treatment.schema';
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

@ApiTags("treatments")
@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
<<<<<<< HEAD
<<<<<<< HEAD
=======
  @ApiOperation({ summary: 'Tạo điều trị mới' })
  @ResponseMessage("Create a new treatment")
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
  @ApiOperation({ summary: 'Tạo điều trị mới' })
  @ResponseMessage("Create a new treatment")
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async create(
    @Body() createTreatmentDto: CreateTreatmentDto,
    @User() user: IUser,
  ) {
    return this.treatmentsService.create(createTreatmentDto, user);
  }

  @Get()
<<<<<<< HEAD
<<<<<<< HEAD
=======
  @ApiOperation({ summary: 'Lấy danh sách điều trị' })
  @ResponseMessage("Get all treatments")
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
  @ApiOperation({ summary: 'Lấy danh sách điều trị' })
  @ResponseMessage("Get all treatments")
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async findAll() {
    return this.treatmentsService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
<<<<<<< HEAD
  async findOne(@Param('id') id: string, user: IUser) {
    return this.treatmentsService.findOne(id, user);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  @ApiOperation({ summary: 'Lấy điều trị theo ID' })
  @ResponseMessage("Get treatment by ID")
  async findOne(@Param('id') id: string) {
    return this.treatmentsService.findOne(id);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật điều trị theo ID' })
  @ResponseMessage("Update treatment by ID")
  async update(
    @Param('id') id: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
    @User() user: IUser,
  ) {
    return this.treatmentsService.update(id, updateTreatmentDto, user);
  }

  @Delete(':id')
<<<<<<< HEAD
<<<<<<< HEAD
  async delete(@Param('id') id: string, user: IUser) {
    return this.treatmentsService.delete(id, user);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  @ApiOperation({ summary: 'Xóa điều trị theo ID' })
  @ResponseMessage("Delete treatment by ID")
  async delete(@Param('id') id: string, @User() user: IUser){
    return this.treatmentsService.remove(id, user);
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  }
}
