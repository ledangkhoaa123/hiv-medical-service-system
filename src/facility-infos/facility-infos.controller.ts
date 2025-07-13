import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FacilityInfosService } from './facility-infos.service';
import { CreateFacilityInfoDto } from './dto/create-facility-infos.dto';
import { UpdateFacilityInfoDto } from './dto/update-facility-infos.dto';
import { Public, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('facilityInfo')
export class FacilityInfosController {
  constructor(private readonly facilityInfosService: FacilityInfosService) {}

  @Post()
  create(
    @Body() createFacilityInfoDto: CreateFacilityInfoDto,
    @User() user: IUser,
  ) {
    return this.facilityInfosService.create(createFacilityInfoDto, user);
  }

  @Get()
  @Public()
  findAll() {
    return this.facilityInfosService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.facilityInfosService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() createFacilityInfoDto: UpdateFacilityInfoDto,
    @User() user: IUser,
  ) {
    return this.facilityInfosService.update(id, createFacilityInfoDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.facilityInfosService.delete(id, user);
  }
}
