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
import {
  MedicalRecord,
  MedicalRecordDocument,
} from './schemas/medical-record.schema';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Patient, PatientDocument } from 'src/patients/schemas/patient.schema';
import { PatientsService } from 'src/patients/patients.service';
import { create } from 'domain';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: SoftDeleteModel<MedicalRecordDocument>,

    private patientsService: PatientsService,
  ) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto, user: IUser) {
    const patient = await this.patientsService.findOne(
      createMedicalRecordDto.patientID.toString(),
    );
    if (!patient) {
      throw new NotFoundException(
        `Patient  ID ${createMedicalRecordDto.patientID} không tồn tại`,
      );
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
    return medicalRecord.populate([
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
      },
    ])
  }

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordModel
      .find()
      .populate([
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
      },
    ]);
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'Không tìm thấy hồ sơ y tế, kiểm tra lại ID',
      );
    }
    const record = await this.medicalRecordModel
      .findOne({ _id: id })
      .populate([
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
      },
    ]);
    return record;
  }
  findOnePersonalID = async (id: string) => {
    const patient = await this.patientsService.findOneByPersonalID(id);
    if (!patient) {
      throw new BadRequestException(
        `Không tìm thấy bệnh nhân với personalId: ${id}`,
      );
    }
    const medical = this.medicalRecordModel.findOne({ patientID: patient.id });
    if (!medical) {
      throw new NotFoundException(
        `Không tìm thấy bệnh án với personalId: ${id}`,
      );
    }
    return medical.populate([
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
      },
    ]);
  };
  async findAllByPatientId(patientID: mongoose.Schema.Types.ObjectId) {
    return await this.medicalRecordModel.find({ patientID }).populate([
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
      },
    ]);
  }

  // Trả về record hoặc null
  async findLatestByPatientId(patientID: mongoose.Schema.Types.ObjectId) {
    return await this.medicalRecordModel
      .findOne({ patientID })
      .populate([
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
      },
    ])
      .sort({ createdAt: -1 });
  }

  async update(
    id: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
    user: IUser,
  ) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy hồ sơ y tế với id=${id}`);
    }

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
