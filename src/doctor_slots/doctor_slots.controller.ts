import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorSlotsService } from './doctor_slots.service';
import { CreateDoctorSlotDto } from './dto/create-doctor_slot.dto';
import { UpdateDoctorSlotDto } from './dto/update-doctor_slot.dto';
import { IUser } from 'src/users/user.interface';
import { Public, User } from 'src/decorator/customize';

@Controller('doctorSlots')
export class DoctorSlotsController {
  constructor(private readonly doctorSlotsService: DoctorSlotsService) { }
  @Public()
  @Post()
  create(@Body() createDoctorSlotDto: CreateDoctorSlotDto, @User() user: IUser) {
    return this.doctorSlotsService.create(createDoctorSlotDto, user);
  }

  @Get()
  @Public()
  findAll() {
    return this.doctorSlotsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.doctorSlotsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorSlotDto: UpdateDoctorSlotDto, @User() user: IUser) {
    return this.doctorSlotsService.update(id, updateDoctorSlotDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.doctorSlotsService.remove(id, user);
  }
}
