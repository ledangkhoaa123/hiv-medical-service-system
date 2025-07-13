import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EducationalDocumentsService } from './educational-documents.service';
import { CreateEducationalDocumentDto } from './dto/create-educational-document.dto';
import { UpdateEducationalDocumentDto } from './dto/update-educational-document.dto';
import { Public, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('educationalDocuments')
export class EducationalDocumentsController {
  constructor(
    private readonly educationalDocumentsService: EducationalDocumentsService,
  ) {}

  @Post()
  async create(
    @Body() createEducationalDocumentDto: CreateEducationalDocumentDto,
    @User() user: IUser,
  ) {
    return this.educationalDocumentsService.create(
      createEducationalDocumentDto,
      user,
    );
  }

  @Get()
  @Public()
  async findAll() {
    return this.educationalDocumentsService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string, @User() user: IUser) {
 
    return this.educationalDocumentsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateEducationalDocumentDto,
    @User() user: IUser,
  ) {
    return this.educationalDocumentsService.update(id, updateDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return this.educationalDocumentsService.remove(id, user);
  }
}
