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
import { TestResultsService } from './test-results.service';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { UpdateTestResultDto } from './dto/update-test-result.dto';
import { TestResult } from './schemas/test-result.schema';
<<<<<<< HEAD
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
=======
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598

@ApiTags("test-results")
@Controller('testResults')
export class TestResultsController {
  constructor(private readonly testResultsService: TestResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo kết quả xét nghiệm mới' })
  @ResponseMessage("Create a new test result")
  async create(
    @Body() createTestResultDto: CreateTestResultDto,
<<<<<<< HEAD
    @User() user: IUser, 
  ){
=======
    @User() user: IUser,
  ) {
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
    return this.testResultsService.create(createTestResultDto, user);
  }

  @Get()
<<<<<<< HEAD
=======
  @ApiOperation({ summary: 'Lấy danh sách kết quả xét nghiệm' })
  @ResponseMessage("Get all test results")
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  async findAll() {
    return this.testResultsService.findAll();
  }

  @Get(':id')
<<<<<<< HEAD
  async findOne(@Param('id') id: string, user: IUser){
    return this.testResultsService.findOne(id, user);
=======
  @ApiOperation({ summary: 'Lấy kết quả xét nghiệm theo ID' })
  @ResponseMessage("Get test result by ID")
  async findOne(@Param('id') id: string) {
    return this.testResultsService.findOne(id);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật kết quả xét nghiệm theo ID' })
  @ResponseMessage("Update test result by ID")
  async update(
    @Param('id') id: string,
    @Body() updateTestResultDto: UpdateTestResultDto,
<<<<<<< HEAD
    @User() user: IUser,
=======
  @User() user: IUser,
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  ) {
    return this.testResultsService.update(id, updateTestResultDto, user);
  }

  @Delete(':id')
<<<<<<< HEAD
  async delete(@Param('id') id: string, user: IUser) {
    return this.testResultsService.delete(id, user);
=======
  @ApiOperation({ summary: 'Xóa kết quả xét nghiệm theo ID' })
  @ResponseMessage("Delete test result by ID")
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.testResultsService.remove(id, user);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
  }
}
