import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecord } from './schemas/medical-record.schema';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecord>,
  ) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto, user: IUser) {
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
    }
    return record;
  }
  async update(
    id: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
    user: IUser,
  ) {
    const updatedRecord = await this.medicalRecordModel
      .findByIdAndUpdate(id, updateMedicalRecordDto, { new: true })
      .exec();

    if (!updatedRecord) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }
    return updatedRecord;
  }
  async delete(id: string, user: IUser) {
    const result = await this.medicalRecordModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }
  }
}
