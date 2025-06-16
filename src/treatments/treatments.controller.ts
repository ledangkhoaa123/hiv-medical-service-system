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
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("treatments")
@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo điều trị mới' })
  @ResponseMessage("Create a new treatment")
  async create(
    @Body() createTreatmentDto: CreateTreatmentDto,
    @User() user: IUser,
  ) {
    return this.treatmentsService.create(createTreatmentDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách điều trị' })
  @ResponseMessage("Get all treatments")
  async findAll() {
    return this.treatmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy điều trị theo ID' })
  @ResponseMessage("Get treatment by ID")
  async findOne(@Param('id') id: string) {
    return this.treatmentsService.findOne(id);
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
  @ApiOperation({ summary: 'Xóa điều trị theo ID' })
  @ResponseMessage("Delete treatment by ID")
  async delete(@Param('id') id: string, @User() user: IUser){
    return this.treatmentsService.remove(id, user);
  }
}
