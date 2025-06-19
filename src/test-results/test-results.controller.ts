import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { UpdateTestResultDto } from './dto/update-test-result.dto';
import { TestResult } from './schemas/test-result.schema';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('testResults')
export class TestResultsController {
  constructor(private readonly testResultsService: TestResultsService) {}

  @Post()
  async create(
    @Body() createTestResultDto: CreateTestResultDto,
    @User() user: IUser, 
  ){
    return this.testResultsService.create(createTestResultDto, user);
  }

  @Get()
  async findAll() {
    return this.testResultsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, user: IUser){
    return this.testResultsService.findOne(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestResultDto: UpdateTestResultDto,
    @User() user: IUser,
  ) {
    return this.testResultsService.update(id, updateTestResultDto, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, user: IUser) {
    return this.testResultsService.delete(id, user);
  }
}
