import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { UpdateTestResultDto } from './dto/update-test-result.dto';
<<<<<<< HEAD
<<<<<<< HEAD
import { TestResult } from './schemas/test-result.schema';
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
import { TestResult, TestResultDocument } from './schemas/test-result.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { TreatmentsService } from 'src/treatments/treatments.service';
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
import { IUser } from 'src/users/user.interface';

@Injectable()
export class TestResultsService {
  constructor(
<<<<<<< HEAD
<<<<<<< HEAD
    @InjectModel(TestResult.name) private testResultModel: Model<TestResult>,
  ) {}

  async create(createTestResultDto: CreateTestResultDto, user: IUser) {
    const createdTestResult = new this.testResultModel(createTestResultDto);
    return createdTestResult.save();
  }
  async findAll() {
    return this.testResultModel.find().populate('treatmentID').exec();
  }
  async findOne(id: string, user: IUser) {
    const testResult = await this.testResultModel
      .findById(id)
      .populate('treatmentID')
      .exec();

    if (!testResult) {
      throw new NotFoundException(`Test result with ID ${id} not found`);
=======
    @InjectModel(TestResult.name)
    private testResultModel: SoftDeleteModel<TestResultDocument>,
    private treatmentsService: TreatmentsService,
  ) {}

  async create(createTestResultDto: CreateTestResultDto, user: IUser) {
=======
    @InjectModel(TestResult.name)
    private testResultModel: SoftDeleteModel<TestResultDocument>,
    private treatmentsService: TreatmentsService,
  ) {}

  async create(createTestResultDto: CreateTestResultDto, user: IUser) {
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    const treatment = await this.treatmentsService.findOne(
      createTestResultDto.treatmentID.toString(),
    );
    if (!treatment) {
      throw new BadRequestException(
        `Không tồn tại Treatment với ID ${createTestResultDto.treatmentID}`,
      );
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    }
    const testResult = await this.testResultModel.create({
      ...createTestResultDto,
      createdBy: { _id: user._id, email: user.email },
    });
    this.treatmentsService.updateTestResultId(
      createTestResultDto.treatmentID as any,
      testResult._id as any,
    );
    return testResult;
  }
<<<<<<< HEAD
<<<<<<< HEAD
  async update(
    id: string,
    updateTestResultDto: UpdateTestResultDto,
    user: IUser,
  ) {
    const updatedTestResult = await this.testResultModel
      .findByIdAndUpdate(id, updateTestResultDto, { new: true })
      .exec();

    if (!updatedTestResult) {
      throw new NotFoundException(`Test result with ID ${id} not found`);
    }
    return updatedTestResult;
  }
  async delete(id: string, user: IUser) {
    const result = await this.testResultModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Test result with ID ${id} not found`);
=======

  async findAll() {
    return this.testResultModel.find();
  }

  async findOne(id: string): Promise<TestResult> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(`Không tìm thấy TestResult với id=${id}`);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
    }
    const testResult = await this.testResultModel
      .findOne({ _id: id })
    return testResult;
  }
<<<<<<< HEAD
=======
=======

  async findAll() {
    return this.testResultModel.find();
  }

  async findOne(id: string): Promise<TestResult> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(`Không tìm thấy TestResult với id=${id}`);
    }
    const testResult = await this.testResultModel
      .findOne({ _id: id })
    return testResult;
  }
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async update(
    id: string,
    updateTestResultDto: UpdateTestResultDto,
    user: IUser,
  ) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy TestResult với id=${id}`);
    }
    return this.testResultModel.updateOne(
        { _id: id },
        {
          ...updateTestResultDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
  }
  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy TestResult với id=${id}`);
    }
    await this.testResultModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.testResultModel.softDelete({
      _id: id,
    });
  }
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
}
