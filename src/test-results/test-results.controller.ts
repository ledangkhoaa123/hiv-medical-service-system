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

@Controller('testResults')
export class TestResultsController {
  constructor(private readonly testResultsService: TestResultsService) {}

  @Post()
  async create(
    @Body() createTestResultDto: CreateTestResultDto,
  ): Promise<TestResult> {
    return this.testResultsService.create(createTestResultDto);
  }

  @Get()
  async findAll(): Promise<TestResult[]> {
    return this.testResultsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TestResult> {
    return this.testResultsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestResultDto: UpdateTestResultDto,
  ): Promise<TestResult> {
    return this.testResultsService.update(id, updateTestResultDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.testResultsService.delete(id);
  }
}
