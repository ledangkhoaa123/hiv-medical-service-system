import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePrescribedRegimentDto } from './dto/create-prescribed_regiment.dto';
import { UpdatePrescribedRegimentDto } from './dto/update-prescribed_regiment.dto';
import {
  PrescribedRegiment,
  PrescribedRegimentDocument,
} from './schemas/prescribed_regiment.schema';
import { ArvRegimentsService } from 'src/arv_regiments/arv_regiments.service';
import { TestType } from 'src/enums/all_enums';
import { IUser } from 'src/users/user.interface';
import { TreatmentsService } from 'src/treatments/treatments.service';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { TestResult, TestResultDocument } from 'src/test-results/schemas/test-result.schema';

@Injectable()
export class PrescribedRegimentsService {
  constructor(
    @InjectModel(PrescribedRegiment.name)
    private prescribedRegimentModel: SoftDeleteModel<PrescribedRegimentDocument>,
    private treatmentsService: TreatmentsService,
    private arvRegimentsService: ArvRegimentsService,
    @InjectModel(TestResult.name)
    private testResultModel: SoftDeleteModel<TestResultDocument>
  ) {}

  async create(
    createPrescribedRegimentDto: CreatePrescribedRegimentDto,
    user: IUser,
  ) {
    if (
      !(await this.treatmentsService.findOne(
        createPrescribedRegimentDto.treatmentID.toString(),
      ))
    ) {
      throw new BadRequestException(
        `Không tìm thấy treatment với id: ${createPrescribedRegimentDto.treatmentID}`,
      );
    }
    if (
      !(await this.arvRegimentsService.findOne(
        createPrescribedRegimentDto.baseRegimentID.toString(),
      ))
    ) {
      throw new BadRequestException(
        `Không tìm thấy phác đồ cơ sở với id: ${createPrescribedRegimentDto.treatmentID}`,
      );
    }
    const prescribedRegiment = await this.prescribedRegimentModel.create({
      ...createPrescribedRegimentDto,
      createdBy: {
        _id: user._id,
        email: user.email,
        name: user.name, 
      },
    });
    this.treatmentsService.updatePrescribedRegimentID(
      createPrescribedRegimentDto.treatmentID as any,
      prescribedRegiment._id as any,
    );
    return {
      _id: prescribedRegiment._id,
      createdAt: prescribedRegiment.createdAt,
    };
  }
  async findAll() {
    return this.prescribedRegimentModel
      .find()
      .populate({
        path: 'baseRegimentID',
        select: { _id: 1, name: 1, regimenType: 1, sideEffects: 1, drugs: 1 },
        populate: {
          path: 'drugs.drugId',
          select: { genericName: 1, group: 1 },
        },
      })
      .populate({
        path: 'customDrugs.drugId',
        select: { genericName: 1, group: 1 },
      });
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Không tìm thấy phác đồ cá nhân với id=${id}`,
      );
    }
    return await this.prescribedRegimentModel
      .findOne({ _id: id })
      .populate({
        path: 'baseRegimentID',
        select: { _id: 1, name: 1, regimenType: 1, sideEffects: 1, drugs: 1 },
        populate: {
          path: 'drugs.drugId',
          select: { genericName: 1, group: 1 },
        },
      })
      .populate({
        path: 'customDrugs.drugId',
        select: { genericName: 1, group: 1 },
      });
  }
  async update(
    id: string,
    updatePrescribedRegimentDto: UpdatePrescribedRegimentDto,
    user: IUser,
  ) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(
        `Không tìm thấy phác đồ cá nhân với id=${id}`,
      );
    }
    return this.prescribedRegimentModel.updateOne(
      { _id: id },
      {
        ...updatePrescribedRegimentDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(
        `Không tìm thấy phác đồ cá nhân với id=${id}`,
      );
    }
    await this.prescribedRegimentModel.updateOne(
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
    return this.prescribedRegimentModel.softDelete({
      _id: id,
    });
  }

async suggestRegiment(treatmentID: string) {
  const baseRegiments = await this.arvRegimentsService.findAll();
  const testResults = await this.testResultModel.find({ treatmentID }).lean();

  function compare(val1: number | string, op: string, val2: number | string): boolean {
    if (op === 'any') return true;
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      const a = Number(val1), b = Number(val2);
      switch (op) {
        case '<': return a < b;
        case '<=': return a <= b;
        case '=': return a === b;
        case '>=': return a >= b;
        case '>': return a > b;
        case '!=': return a !== b;
        default: return false;
      }
    }

    if (typeof val1 === 'string' && typeof val2 === 'string') {
      switch (op) {
        case '=': return val1 === val2;
        case '!=': return val1 !== val2;
        default: return false;
      }
    }

    return false;
  }

  return baseRegiments.filter(regiment =>
    regiment.criteria.every(cri => {
      const matchedTest = testResults.find(t => t.test_type === cri.test_type);
      if (!matchedTest) return false;
      return compare(matchedTest.test_results, cri.operator, cri.value);
    })
  );
}


}