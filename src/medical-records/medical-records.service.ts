import { Type } from 'class-transformer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import {
  CreateMedicalRecordDto,
  CreateMedicalRecordPersonalIdDto,
} from './dto/create-medical-record.dto';
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
import { TreatmentsService } from 'src/treatments/treatments.service';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: SoftDeleteModel<MedicalRecordDocument>,

    private patientsService: PatientsService,

    private treatmentsService: TreatmentsService
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
    ]);
  }

  createByPersonalID = async (
    createMedicalRecordDto: CreateMedicalRecordPersonalIdDto,
    user: IUser,
    id: string,
    serviceId: string,
  ) => {
    const patient = await this.patientsService.findOneByPersonalID(id);
    if (!patient) {
      throw new NotFoundException(`Patient  ID ${id} không tồn tại`);
    }
    const medicalRecord = await this.medicalRecordModel.create({
      patientID: patient._id,
      ...createMedicalRecordDto,
      tempServiceID: serviceId,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    await this.patientsService.updateMedicalRecord(
      patient.id,
      medicalRecord._id as any,
    );
    return medicalRecord.populate([
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
      },
      {
        path: 'tempServiceID',
        select: 'name price durationMinutes',
      },
    ]);
  };

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordModel.find().populate([
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
    const record = await this.medicalRecordModel.findOne({ _id: id }).populate([
      {
        path: 'patientID',
        select: 'name personalID userID',
        populate: { path: 'userID', select: 'name' },
      },
      {
        path: 'treatmentID',
        select: 'note prescribedRegimentID testResultID',
        populate: { path: 'testResultID', select: 'test_type test_results' },
      }
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
    const medical = await this.medicalRecordModel
      .findOne({
        patientID: patient.id,
      })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: 'patientID',
          select: 'name personalID userID',
          populate: { path: 'userID', select: 'name' },
        },
        {
          path: 'tempServiceID',
          select: 'name price durationMinutes',
        },
      ]);
    if (!medical) {
      throw new NotFoundException(
        `Không tìm thấy bệnh án với personalId: ${id}`,
      );
    }

    return medical;
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
  // 1. Kiểm tra MedicalRecord tồn tại
  const medical = await this.medicalRecordModel.findById(id);
  if (!medical) {
    throw new BadRequestException(`Không tìm thấy hồ sơ y tế với id=${id}`);
  }

  // 2. Gọi PatientService để xóa reference trong patient.medicalRecords[]
  await this.patientsService.removeMedicalRecordFromPatient(
    medical.patientID.toString(),
    id,
  );

  // 3. Gọi TreatmentService để xóa tất cả treatment có liên kết
  await this.treatmentsService.deleteAllByMedicalRecordId(id);

  // 4. Xóa luôn bản ghi medical record
  await this.medicalRecordModel.deleteOne({ _id: id });

  return {
    message: 'Đã xóa hồ sơ bệnh án và các điều trị liên quan',
    medicalRecordId: id,
  };
}

}
