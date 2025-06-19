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
import { PrescribedRegimentsService } from './prescribed_regiments.service';
import {
  CreatePrescribedRegimentDto,
  SuggestRegimentDto,
} from './dto/create-prescribed_regiment.dto';
import { UpdatePrescribedRegimentDto } from './dto/update-prescribed_regiment.dto';
import { PrescribedRegiment } from './schemas/prescribed_regiment.schema';
<<<<<<< HEAD
import { User } from 'src/decorator/customize';
=======
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/decorator/customize';
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
import { IUser } from 'src/users/user.interface';

@ApiTags('Phác đồ cá nhân')
@Controller('prescribedRegiments')
export class PrescribedRegimentsController {
  constructor(
    private readonly prescribedRegimentsService: PrescribedRegimentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo Regiment cá nhân mới' })
  @ResponseMessage('Create a new prescribedRegiments')
  async create(
    @Body() createPrescribedRegimentDto: CreatePrescribedRegimentDto,
    @User() user: IUser,
  ) {
    return this.prescribedRegimentsService.create(
      createPrescribedRegimentDto,
      user,
    );
  }

  @Get()
<<<<<<< HEAD
=======
  @ApiOperation({ summary: 'Lấy tất cả Regiment cá nhân' })
  @ResponseMessage('Show all PrescribedRegiments')
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  async findAll() {
    return this.prescribedRegimentsService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
  async findOne(@Param('id') id: string, user: IUser) {
    return this.prescribedRegimentsService.findOne(id, user);
=======
  @ApiOperation({ summary: 'Lấy Regiment cá nhân theo id' })
  @ResponseMessage('Get a PrescribedRegiment by id')
  async findOne(@Param('id') id: string) {
    return this.prescribedRegimentsService.findOne(id);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Regiment cá nhân theo id' })
  @ResponseMessage('Update PrescribedRegiments by id')
  async update(
    @Param('id') id: string,
    @Body() updatePrescribedRegimentDto: UpdatePrescribedRegimentDto,
    @User() user: IUser,
  ) {
    return this.prescribedRegimentsService.update(
      id,
      updatePrescribedRegimentDto,
      user,
    );
  }

  @Delete(':id')
<<<<<<< HEAD
  async delete(@Param('id') id: string, user: IUser) {
    return this.prescribedRegimentsService.delete(id, user);
=======
  @ApiOperation({ summary: 'Delete Regiment cá nhân theo id' })
  @ResponseMessage('Delete PrescribedRegiments by id')
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.prescribedRegimentsService.remove(id, user);
  }

  @Post('suggest')
  @ApiOperation({ summary: 'Gợi ý Regiment cá nhân theo testResults' })
  @ResponseMessage('Suggest PrescribedRegiments by TestResults')
  async suggestRegiment(@Body() dto: SuggestRegimentDto) {
    return this.prescribedRegimentsService.suggestRegiment(dto.testResults);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }
}
