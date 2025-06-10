import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('doctors')
@ApiTags("doctors")
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }
  @Public()
  @Post()
  @ResponseMessage("Create a new Doctor")
  create(@Body() createDoctorDto: CreateDoctorDto, @User() user: IUser) {
    return this.doctorsService.create(createDoctorDto, user);
  }

  @Get()
  @Public()
  findAll() {
    return this.doctorsService.findAll();
  }


  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto, @User() user: IUser) {
    return this.doctorsService.update(id, updateDoctorDto, user);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.doctorsService.remove(id, user);
  }
}
