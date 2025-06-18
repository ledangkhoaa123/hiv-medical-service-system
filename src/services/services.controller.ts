import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { IUser } from 'src/users/user.interface';
import { Public, User } from 'src/decorator/customize';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }
 
  @Post()
  create(@Body() createServiceDto: CreateServiceDto, @User() user: IUser) {
    return this.servicesService.create(createServiceDto, user);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto,@User() user: IUser) {
    return this.servicesService.update(id, updateServiceDto,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@User() user: IUser) {
    return this.servicesService.remove(id,user);
  }
}
