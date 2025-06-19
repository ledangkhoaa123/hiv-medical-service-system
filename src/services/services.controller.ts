import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { IUser } from 'src/users/user.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Dịch vụ')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }
  @ApiOperation({ summary: 'Tạo dịch vụ mới' })
  @ApiBody({ type: CreateServiceDto })
  @ResponseMessage("Tạo dịch vụ mới")
  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @User() user: IUser) {
    return this.servicesService.create(createServiceDto, user);
  }
  @Public()
  @ApiOperation({ summary: 'Lấy tất cả dịch vụ' })
  @ResponseMessage("Lấy tất cả dịch vụ")
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }
  @Public()
  @ResponseMessage("Lấy chi tiết dịch vụ theo id")
  @ApiOperation({ summary: 'Lấy chi tiết dịch vụ theo id' })
  @ApiParam({ name: 'id', required: true, description: 'ID dịch vụ' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }
  @ResponseMessage("Cập nhật dịch vụ")
  @ApiOperation({ summary: 'Cập nhật dịch vụ' })
  @ApiParam({ name: 'id', required: true, description: 'ID dịch vụ' })
  @ApiBody({ type: UpdateServiceDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto, @User() user: IUser) {
    return this.servicesService.update(id, updateServiceDto, user);
  }
  @ResponseMessage("Xóa dịch vụ")
  @ApiOperation({ summary: 'Xóa dịch vụ' })
  @ApiParam({ name: 'id', required: true, description: 'ID dịch vụ' })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.servicesService.remove(id, user);
  }
}
