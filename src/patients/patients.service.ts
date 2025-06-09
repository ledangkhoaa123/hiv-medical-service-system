import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import mongoose from 'mongoose';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { pick } from 'lodash';
@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: SoftDeleteModel<PatientDocument>,
  ) { }
  async create(createPatientDto: CreatePatientDto, user: IUser) {
    const IsExist = await this.patientModel.findOne({
      userID: createPatientDto.userID,
    });
    if (IsExist) {
      throw new BadRequestException('PatientId đã tồn tại');
    }

    const patient = await this.patientModel.create({
      ...createPatientDto
    });
    return {
      createdBy: {
        // _id: user._id,
        // email: user.email,
      },
      createdAt: patient.createdAt
    };
  }

  findAll() {
    return this.patientModel.find()
    .populate({
    path: 'userID',
    select: 'name phone'  
  });
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Patient with id=${id}`);
    }
    return this.patientModel.findOne({ _id: id })
    .populate({
    path: 'userID',
    select: 'name phone'  
  });
  }

  update(id: string, updatePatientDto: UpdatePatientDto, user: IUser) {
    const fieldsToUpdate = pick(updatePatientDto, [
      'firstName',
      'lastName',
      'gender',
      'contactEmails',
      'contactPhones',
      'wallet',
    ]);

    return this.patientModel.findOneAndUpdate(
      { _id: id },
      {
        ...fieldsToUpdate,
        updatedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
      { new: true }
    );
  }

  async remove(id: string, user: IUser) {
    await this.patientModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
    );
    return this.patientModel.softDelete({
      _id: id,
    });
  }
}
