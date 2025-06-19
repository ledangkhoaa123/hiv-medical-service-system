import { IsMongoId } from 'class-validator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo } from 'mongoose';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
<<<<<<< HEAD
<<<<<<< HEAD
import { Treatment } from './schemas/treatment.schema';
import { IUser } from 'src/users/user.interface';
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
import { Treatment, TreatmentDocument } from './schemas/treatment.schema';
import { IUser } from 'src/users/user.interface';

import { MedicalRecordsService } from 'src/medical-records/medical-records.service';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectModel(Treatment.name)
    private treatmentModel: SoftDeleteModel<TreatmentDocument>,
    private medicalRecordsService: MedicalRecordsService,
  ) {}

  async create(createTreatmentDto: CreateTreatmentDto, user: IUser) {
<<<<<<< HEAD
<<<<<<< HEAD
    const createdTreatment = new this.treatmentModel(createTreatmentDto);
    return createdTreatment.save();
  }
  async findAll(): Promise<Treatment[]> {
    return this.treatmentModel
      .find()
      .populate('medicalRecordID')
      .populate('doctorID')
      .exec();
  }
  async findOne(id: string, user: IUser) {
    const treatment = await this.treatmentModel
      .findById(id)
      .populate('medicalRecordID')
      .populate('doctorID')
      .exec();

    if (!treatment) {
      throw new NotFoundException(`Treatment with ID ${id} not found`);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    const medicalRecord = await this.medicalRecordsService.findOne(
      createTreatmentDto.medicalRecordID.toString(),
    );
    if (!medicalRecord) {
      throw new BadRequestException(
        `Không tồn tại MedicalRecord với ID ${createTreatmentDto.medicalRecordID}`,
      );
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    }
    const treatment = await this.treatmentModel.create({
      ...createTreatmentDto,
      createdBy: { _id: user._id, email: user.email },
    });
    this.medicalRecordsService.updateTreatmentId(
      createTreatmentDto.medicalRecordID,
      treatment._id as any,
    );
    return treatment;
  }
  async findAll() {
    return this.treatmentModel.find().populate([
      {
        path: 'testResultID',
        select: { _id: 1, test_type: 1, test_results: 1, test_date: 1 },
      },
      { path: 'prescribedRegimentID', select: '_id' },
      { path: 'previousTreatmentID', select: '_id' },
      { path: 'doctorID', select: '_id' },
    ]);
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
    }
    const treatment = await this.treatmentModel.findOne({ _id: id }).populate([
      {
        path: 'testResultID',
        select: '_id, test_type, test_results, test_date',
      },
      { path: 'prescribedRegimentID', select: '_id' },
      { path: 'previousTreatmentID', select: '_id' },
      { path: 'doctorID', select: '_id' },
    ]);
    return treatment;
  }
  async update(
    id: string,
    updateTreatmentDto: UpdateTreatmentDto,
    user: IUser,
  ) {
<<<<<<< HEAD
<<<<<<< HEAD
    const updatedTreatment = await this.treatmentModel
      .findByIdAndUpdate(id, updateTreatmentDto, { new: true })
      .exec();
=======
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
    }
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
    }
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf

    return this.treatmentModel.updateOne(
      { _id: id },
      {
        ...updateTreatmentDto,
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
    const result = await this.treatmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Treatment with ID ${id} not found`);
=======
  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    }
    await this.treatmentModel.updateOne(
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
    return this.treatmentModel.softDelete({
      _id: id,
    });
  }
  updateTestResultId = async (
    treatmentId: mongoose.Schema.Types.ObjectId,
    testResultId: mongoose.Schema.Types.ObjectId,
  ) => {
    const record = await this.findOne(treatmentId as any);
    if (record) {
      return await this.treatmentModel.updateOne(
        { _id: record._id },
        { $addToSet: { testResultID: testResultId } },
      );
    }
  };
  updatePrescribedRegimentID = async (
    treatmentId: mongoose.Schema.Types.ObjectId,
    prescribedId: mongoose.Schema.Types.ObjectId,
  ) => {
    const record = await this.findOne(treatmentId as any);
    if (record) {
      return await this.treatmentModel.updateOne(
        { _id: record._id },
        { prescribedRegimentID: prescribedId },
      );
    }
  };
}
