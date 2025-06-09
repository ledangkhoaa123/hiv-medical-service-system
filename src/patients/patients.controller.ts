import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }
  @Public()
  @ResponseMessage('Create a patient')
  @Post()
  create(@Body() createPatientDto: CreatePatientDto,@User() user:IUser) {
    return this.patientsService.create(createPatientDto,user);
  }
  @Public()
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }
  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto, user: IUser) {
    return this.patientsService.update(id, updatePatientDto, user);
  }
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string,user: IUser) {
    return this.patientsService.remove(id,user);
  }
}
