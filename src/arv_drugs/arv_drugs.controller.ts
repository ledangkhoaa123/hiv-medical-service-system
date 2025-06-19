import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ArvDrugsService } from './arv_drugs.service';
import { CreateArvDrugDto } from './dto/create-arv_drug.dto';
import { UpdateArvDrugDto } from './dto/update-arv_drug.dto';
import { ArvDrug } from './schemas/arv_drug.schema';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('drugs')
export class ArvDrugsController {
  constructor(private readonly arvDrugsService: ArvDrugsService) {}

  @Post()
  async create(
    @Body() createArvDrugDto: CreateArvDrugDto,
    @User() user: IUser,
  ) {
    return this.arvDrugsService.create(createArvDrugDto, user);
  }

  @Get()
  async findAll() {
    return this.arvDrugsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, user: IUser) {
    return this.arvDrugsService.findOne(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArvDrugDto: UpdateArvDrugDto,
    @User() user: IUser,
  ) {
    return this.arvDrugsService.update(id, updateArvDrugDto, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, user: IUser) {
    return this.arvDrugsService.delete(id, user);
  }
}
