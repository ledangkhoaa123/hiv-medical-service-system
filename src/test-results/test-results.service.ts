import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { UpdateTestResultDto } from './dto/update-test-result.dto';
import { TestResult } from './schemas/test-result.schema';

@Injectable()
export class TestResultsService {
  constructor(@InjectModel(TestResult.name) private testResultModel: Model<TestResult>) {}

  async create(createTestResultDto: CreateTestResultDto): Promise<TestResult> {
    const createdTestResult = new this.testResultModel(createTestResultDto);
    return createdTestResult.save();
  }
  async findAll(): Promise<TestResult[]> {
    return this.testResultModel.find()
      .populate('treatmentID')
      .exec();
  }
  async findOne(id: string): Promise<TestResult> {
    const testResult = await this.testResultModel.findById(id)
      .populate('treatmentID')
      .exec();
    
    if (!testResult) {
      throw new NotFoundException(`Test result with ID ${id} not found`);
    }
    return testResult;
  }
  async update(id: string, updateTestResultDto: UpdateTestResultDto): Promise<TestResult> {
    const updatedTestResult = await this.testResultModel
      .findByIdAndUpdate(id, updateTestResultDto, { new: true })
      .exec();
    
    if (!updatedTestResult) {
      throw new NotFoundException(`Test result with ID ${id} not found`);
    }
    return updatedTestResult;
  }
  async delete(id: string): Promise<void> {
    const result = await this.testResultModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Test result with ID ${id} not found`);
    }
  }
}