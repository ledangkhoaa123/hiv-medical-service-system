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
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ARV Regiments')
@Controller('regiments')
export class ArvRegimentsController {
  constructor(private readonly arvRegimentsService: ArvRegimentsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ARV Regiment mới' })
  @ResponseMessage("Create a new ARV Regiment")
  async create(
    @Body() createArvRegimentDto: CreateArvRegimentDto,
    @User() user: IUser, // Assuming User decorator returns user info
  ) {
    return this.arvRegimentsService.create(createArvRegimentDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách ARV Regiments' })
  @ResponseMessage("Get all ARV Regiments")
  async findAll() {
    return this.arvRegimentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin ARV Regiment theo ID' })
  @ResponseMessage("Get ARV Regiment by ID")
  async findOne(@Param('id') id: string) {
    return this.arvRegimentsService.findOne(id);
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
  @ApiOperation({ summary: 'Xóa ARV Regiment theo ID' })
  @ResponseMessage("Delete ARV Regiment by ID")
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.arvRegimentsService.remove(id, user);
  }
}
