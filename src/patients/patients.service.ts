import { UpdateMedicalRecordDto } from './../medical-records/dto/update-medical-record.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import mongoose from 'mongoose';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { pick } from 'lodash';
import { User, UserDocument } from 'src/users/schemas/user.schema';
@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name)
    private patientModel: SoftDeleteModel<PatientDocument>,
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}
  async createCustomer(createPatientDto: CreatePatientDto, user: IUser) {
    const IsExist = await this.userModel.findOne({
      _id: createPatientDto.userID,
    });
    if (!IsExist) {
      throw new BadRequestException('UserID không hợp lệ');
    }
    try {
      const patient = await this.patientModel.create({
        ...createPatientDto,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      return {
        _id: patient._id,
        createdAt: patient.createdAt,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `UserID hoặc personalID đã tồn tại`,
        );
      }
    }
  }

  findAll() {
    return this.patientModel.find().populate({
      path: 'userID',
      select: 'name phone',
    });
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Patient with id=${id}`);
    }
    return this.patientModel.findOne({ _id: id }).populate({
      path: 'userID',
      select: 'name phone',
    });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Not found Patient with id=${id}`);
      
    }
    if (updatePatientDto.userID) {
    const existing = await this.patientModel.findOne({
      userID: updatePatientDto.userID,
      _id: { $ne: id }, // Exclude current patient
    });
    if (existing) {
      throw new BadRequestException('UserID đã tồn tại');
    }
  }
    try {
      return this.patientModel.findOneAndUpdate(
      { _id: id },
      {
        ...updatePatientDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `UserID đã tồn tại`,
        );
      }
      
    }
  }

  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Not found Patient with id=${id}`);
      
    }
    await this.patientModel.updateOne(
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
    return this.patientModel.softDelete({
      _id: id,
    });
  }
  UpdateMedicalRecord= async (id: mongoose.Schema.Types.ObjectId, newMedicalRecordID: mongoose.Schema.Types.ObjectId) => {
    const patient = await this.findOne(id.toString());
    if (!patient) {
      throw new BadRequestException(`Not found Patient with id=${id}`);
    }
    return patient.medicalRecordID.push(newMedicalRecordID);
    
  }
}
