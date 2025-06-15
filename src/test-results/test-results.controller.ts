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
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("test-results")
@Controller('testResults')
export class TestResultsController {
  constructor(private readonly testResultsService: TestResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo kết quả xét nghiệm mới' })
  @ResponseMessage("Create a new test result")
  async create(
    @Body() createTestResultDto: CreateTestResultDto,
    @User() user: IUser,
  ) {
    return this.testResultsService.create(createTestResultDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách kết quả xét nghiệm' })
  @ResponseMessage("Get all test results")
  async findAll() {
    return this.testResultsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy kết quả xét nghiệm theo ID' })
  @ResponseMessage("Get test result by ID")
  async findOne(@Param('id') id: string) {
    return this.testResultsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật kết quả xét nghiệm theo ID' })
  @ResponseMessage("Update test result by ID")
  async update(
    @Param('id') id: string,
    @Body() updateTestResultDto: UpdateTestResultDto,
  @User() user: IUser,
  ) {
    return this.testResultsService.update(id, updateTestResultDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa kết quả xét nghiệm theo ID' })
  @ResponseMessage("Delete test result by ID")
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.testResultsService.remove(id, user);
  }
}
