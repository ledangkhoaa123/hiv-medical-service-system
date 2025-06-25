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
import {
  CreateGuestPatientDto,
  CreatePatientDto,
  PersonalIDDto,
} from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('patients')
@ApiTags('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @ApiOperation({ summary: 'Tạo bệnh nhân mới (khách)' })
  @ResponseMessage('Create a patient by guest')
  @Post('guest')
  @Public()
  createByGuest(
    @Body() createPatientDto: CreateGuestPatientDto,
  ) {
    return this.patientsService.createGuest(createPatientDto);

  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách bệnh nhân' })
  @ResponseMessage('Get all patients')
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin bệnh nhân theo ID' })
  @ResponseMessage('Get patient by ID')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin bệnh nhân theo ID' })
  @ResponseMessage('Update patient by ID')
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @User() user: IUser,
  ) {
    return this.patientsService.update(id, updatePatientDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Vô hiệu hóa bệnh nhân theo ID' })
  @ResponseMessage('Delete patient by ID')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.patientsService.remove(id, user);
  }

  @Post('by-personal-id')
  @Public()
  @ApiOperation({ summary: 'Lấy thông tin bệnh nhân theo PersonalID' })
  @ApiBody({type: PersonalIDDto})
  @ResponseMessage('Get patient by PersonalID')
  findOneByPersonalID(@Body() personalIDdto: PersonalIDDto) {
    return this.patientsService.findOneByPersonalID(personalIDdto.personalID);
  }

  @Post('by-token')
  @ApiOperation({ summary: 'Lấy thông tin bệnh nhân theo Token' })
  @ResponseMessage('Get patient by Token')
  findOneByToken(@User() user: IUser) {
    return this.patientsService.findOneByToken(user);
  }
}

