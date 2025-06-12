import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreateGuestPatientDto, CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('patients')
@ApiTags('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}


  @ResponseMessage('Create a patient by guest')
  @Post('guest')
  createByGuest(@Body() createPatientDto: CreateGuestPatientDto, @User() user: IUser) {
    return this.patientsService.createGuest(createPatientDto, user);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @User() user: IUser,
  ) {
    return this.patientsService.update(id, updatePatientDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@User() user: IUser) {
    return this.patientsService.remove(id, user);
  }
}
