import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateTestResultDto } from './dto/create-test-result.dto';
import { UpdateTestResultDto } from './dto/update-test-result.dto';
import { TestResult, TestResultDocument } from './schemas/test-result.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

import { TreatmentsService } from 'src/treatments/treatments.service';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class TestResultsService {
  constructor(
    @InjectModel(TestResult.name)
    private testResultModel: SoftDeleteModel<TestResultDocument>,
    private treatmentsService: TreatmentsService,
  ) {}

  async create(createTestResultDto: CreateTestResultDto, user: IUser) {
    const treatment = await this.treatmentsService.findOne(
      createTestResultDto.treatmentID.toString(),
    );
    if (!treatment) {
      throw new BadRequestException(
        `Không tồn tại Treatment với ID ${createTestResultDto.treatmentID}`,
      );
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
}
