import { Type } from 'class-transformer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
<<<<<<< HEAD
<<<<<<< HEAD
import { MedicalRecord } from './schemas/medical-record.schema';
import { IUser } from 'src/users/user.interface';
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
import {
  MedicalRecord,
  MedicalRecordDocument,
} from './schemas/medical-record.schema';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Patient, PatientDocument } from 'src/patients/schemas/patient.schema';
import { PatientsService } from 'src/patients/patients.service';
import { create } from 'domain';
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: SoftDeleteModel<MedicalRecordDocument>,

    private patientsService: PatientsService,
  ) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto, user: IUser) {
<<<<<<< HEAD
<<<<<<< HEAD
    const createdRecord = new this.medicalRecordModel(createMedicalRecordDto);
    return createdRecord.save();
  }
  async findAll() {
    return (
      this.medicalRecordModel
        .find()
        .populate('patientID', 'profile')
        //.populate('guestID')
        .populate('doctorID')
        .exec()
    );
  }
  async findOne(id: string) {
    const record = await this.medicalRecordModel
      .findById(id)
      .populate('patientID', 'profile')
      //.populate('guestID')
      .populate('doctorID')
      .exec();

    if (!record) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
=======
    const patient = await this.patientsService.findOne(
      createMedicalRecordDto.patientID.toString(),
    );
=======
    const patient = await this.patientsService.findOne(
      createMedicalRecordDto.patientID.toString(),
    );
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    if (!patient) {
      throw new NotFoundException(
        `Patient  ID ${createMedicalRecordDto.patientID} không tồn tại`,
      );
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    }
    const medicalRecord = await this.medicalRecordModel.create({
      ...createMedicalRecordDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    await this.patientsService.updateMedicalRecord(
      createMedicalRecordDto.patientID,
      medicalRecord._id as any,
    );
    return {
      _id: medicalRecord._id,
      createdAt: medicalRecord.createdAt,
    };
  }

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordModel
      .find()
      .populate([{ path: 'treatmentID', select: 'profile' }]);
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new BadRequestException('Không tìm thấy hồ sơ y tế, kiểm tra lại ID');
        }
    const record = await this.medicalRecordModel
      .findOne({ _id: id })
      .populate([{ path: 'treatmentID', select: 'profile' }]);
    return record;
  }
  async findAllByPatientId(patientID: mongoose.Schema.Types.ObjectId) {
  return await this.medicalRecordModel.find({ patientID });
}

// Trả về record hoặc null
async findLatestByPatientId(patientID: mongoose.Schema.Types.ObjectId) {
  return await this.medicalRecordModel
    .findOne({ patientID })
    .sort({ createdAt: -1 });
}

  async update(
    id: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
    user: IUser,
  ) {
<<<<<<< HEAD
<<<<<<< HEAD
    const updatedRecord = await this.medicalRecordModel
      .findByIdAndUpdate(id, updateMedicalRecordDto, { new: true })
      .exec();
=======
     if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy hồ sơ y tế với id=${id}`);
    }
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
     if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy hồ sơ y tế với id=${id}`);
    }
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf

    return this.medicalRecordModel.updateOne(
      { _id: id },
      {
        ...updateMedicalRecordDto,
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
    const result = await this.medicalRecordModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  updateTreatmentId = async (
    medicalRecordId: mongoose.Schema.Types.ObjectId,
    treatementID: mongoose.Schema.Types.ObjectId,
  ) => {
    const record = await this.findOne(medicalRecordId as any);
    if (record) {
      return await this.medicalRecordModel.updateOne(
        { _id: record._id },
        { $addToSet: { treatmentID: treatementID } },
      );
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    }
  };

  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy hồ sơ y tế với id=${id}`);
    }
    await this.medicalRecordModel.updateOne(
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
    return this.medicalRecordModel.softDelete({
      _id: id,
    });
  }
}
