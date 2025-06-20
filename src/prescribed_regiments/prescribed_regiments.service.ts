import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePrescribedRegimentDto } from './dto/create-prescribed_regiment.dto';
import { UpdatePrescribedRegimentDto } from './dto/update-prescribed_regiment.dto';
<<<<<<< HEAD
<<<<<<< HEAD
import { PrescribedRegiment } from './schemas/prescribed_regiment.schema';
import { IUser } from 'src/users/user.interface';
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
import {
  PrescribedRegiment,
  PrescribedRegimentDocument,
} from './schemas/prescribed_regiment.schema';
import { ArvRegimentsService } from 'src/arv_regiments/arv_regiments.service';
import { TestType } from 'src/enums/all_enums';
import { IUser } from 'src/users/user.interface';
import { TreatmentsService } from 'src/treatments/treatments.service';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf

@Injectable()
export class PrescribedRegimentsService {
  constructor(
    @InjectModel(PrescribedRegiment.name)
    private prescribedRegimentModel: SoftDeleteModel<PrescribedRegimentDocument>,
    private treatmentsService: TreatmentsService,
    private arvRegimentsService: ArvRegimentsService,
  ) {}

  async create(
    createPrescribedRegimentDto: CreatePrescribedRegimentDto,
    user: IUser,
  ) {
<<<<<<< HEAD
<<<<<<< HEAD
    const createdRegiment = new this.prescribedRegimentModel(
      createPrescribedRegimentDto,
    );
    return createdRegiment.save();
  }
  async findAll() {
    return this.prescribedRegimentModel
      .find()
      .populate('treatmentID')
      .populate('baseRegimentID')
      .populate('prescribedBy')
      .exec();
  }
  async findOne(id: string, user: IUser) {
    const prescribedRegiment = await this.prescribedRegimentModel
      .findById(id)
      .populate('treatmentID')
      .populate('baseRegimentID')
      .populate('prescribedBy')
      .exec();

    if (!prescribedRegiment) {
      throw new NotFoundException(
        `Prescribed regiment with ID ${id} not found`,
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    if (
      !(await this.treatmentsService.findOne(
        createPrescribedRegimentDto.treatmentID.toString(),
      ))
    ) {
      throw new BadRequestException(
        `Không tìm thấy treatment với id: ${createPrescribedRegimentDto.treatmentID}`,
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
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
<<<<<<< HEAD
<<<<<<< HEAD
    const updatedPrescribedRegiment = await this.prescribedRegimentModel
      .findByIdAndUpdate(id, updatePrescribedRegimentDto, { new: true })
      .exec();

    if (!updatedPrescribedRegiment) {
      throw new NotFoundException(
        `Prescribed regiment with ID ${id} not found`,
=======
    if (!(await this.findOne(id))) {
      throw new BadRequestException(
        `Không tìm thấy phác đồ cá nhân với id=${id}`,
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
    if (!(await this.findOne(id))) {
      throw new BadRequestException(
        `Không tìm thấy phác đồ cá nhân với id=${id}`,
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
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
<<<<<<< HEAD
<<<<<<< HEAD
  async delete(id: string, user: IUser) {
    const result = await this.prescribedRegimentModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(
        `Prescribed regiment with ID ${id} not found`,
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(
        `Không tìm thấy phác đồ cá nhân với id=${id}`,
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
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

  async suggestRegiment(
    testResults: { test_type: TestType; test_results: number | string }[],
  ) {
    const baseRegiments = await this.arvRegimentsService.findAll();

    // Hàm so sánh giá trị
    function compare(
      val1: number | string,
      op: string,
      val2: number | string,
    ): boolean {
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        const a = Number(val1),
          b = Number(val2);
        switch (op) {
          case '<':
            return a < b;
          case '<=':
            return a <= b;
          case '=':
            return a === b;
          case '>=':
            return a >= b;
          case '>':
            return a > b;
          case '!=':
            return a !== b;
          default:
            return false;
        }
      }
      if (typeof val1 === 'string' && typeof val2 === 'string') {
        switch (op) {
          case '=':
            return val1 === val2;
          case '!=':
            return val1 !== val2;
          default:
            return false;
        }
      }
      return false;
    }

    return baseRegiments.filter(
      (regiment) =>
        regiment.criteria.every((cri) => {
          const test = testResults.find((t) => t.test_type === cri.test_type);
          if (!test) return false;
          return compare(test.test_results, cri.operator, cri.value);
        }),
    );
  }
}
