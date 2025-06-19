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
import { ArvDrugsService } from './arv_drugs.service';
import { CreateArvDrugDto } from './dto/create-arv_drug.dto';
import { UpdateArvDrugDto } from './dto/update-arv_drug.dto';
import { ArvDrug } from './schemas/arv_drug.schema';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ARV Drugs')
@Controller('drugs')
export class ArvDrugsController {
  constructor(private readonly arvDrugsService: ArvDrugsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thuốc mới' })
  @ResponseMessage("Create a new drug")
  async create(
    @Body() createArvDrugDto: CreateArvDrugDto,
    @User() user: IUser,
  ) {
    return this.arvDrugsService.create(createArvDrugDto, user);
  }

  @Get()
<<<<<<< HEAD
=======
  @ApiOperation({ summary: 'Lấy danh sách thuốc' })
  @ResponseMessage("Get all drugs")
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  async findAll() {
    return this.arvDrugsService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
  async findOne(@Param('id') id: string, user: IUser) {
    return this.arvDrugsService.findOne(id, user);
=======
  @ApiOperation({ summary: 'Lấy thuốc theo ID' })
  @ResponseMessage("Get drug by ID")
  async findOne(@Param('id') id: string) {
    return this.arvDrugsService.findOne(id);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thuốc theo ID' })
  @ResponseMessage("Update drug by ID")
  async update(
    @Param('id') id: string,
    @Body() updateArvDrugDto: UpdateArvDrugDto,
    @User() user: IUser,
  ) {
    return this.arvDrugsService.update(id, updateArvDrugDto, user);
  }

  @Delete(':id')
<<<<<<< HEAD
  async delete(@Param('id') id: string, user: IUser) {
    return this.arvDrugsService.delete(id, user);
=======
  @ApiOperation({ summary: 'Xóa thuốc theo ID' })
  @ResponseMessage("Delete drug by ID")
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.arvDrugsService.remove(id, user);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }
}
