import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecord, MedicalRecordDocument } from './schemas/medical-record.schema';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Patient, PatientDocument } from 'src/patients/schemas/patient.schema';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: SoftDeleteModel<MedicalRecordDocument>,
    
    private patientsService: PatientsService
  ) {}

  async create(
    createMedicalRecordDto: CreateMedicalRecordDto,
    user: IUser
  ) {
    const patient = await this.patientsService.findOne(createMedicalRecordDto.patientID.toString());
    if (!patient) {
      throw new NotFoundException(`Patient  ID ${createMedicalRecordDto.patientID} không tồn tại`);
    }
    const medicalRecord = this.medicalRecordModel.create({
      ...createMedicalRecordDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
   
  }

  async findAll(): Promise<MedicalRecord[]> {
    return (
      this.medicalRecordModel
        .find()
        //.populate('patientID', 'profile') // Populate patient with profile information
        //.populate('guestID')
        //.populate('doctorID')
        .exec()
    );
  }
  async findOne(id: string): Promise<MedicalRecord> {
    const record = await this.medicalRecordModel
      .findById(id)
      //.populate('patientID', 'profile')
      //.populate('guestID')
      //.populate('doctorID')
      .exec();

    if (!record) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }
    return record;
  }
  async update(
    id: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    const updatedRecord = await this.medicalRecordModel
      .findByIdAndUpdate(id, updateMedicalRecordDto, { new: true })
      .exec();

    if (!updatedRecord) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }
    return updatedRecord;
  }
  async delete(id: string): Promise<void> {
    const result = await this.medicalRecordModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }
  }
}
