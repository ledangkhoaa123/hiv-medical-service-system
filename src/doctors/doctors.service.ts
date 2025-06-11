import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import { pick } from 'lodash';
import path from 'path';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name)
    private doctorModel: SoftDeleteModel<DoctorDocument>,

    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  async create(createdoctorDto: CreateDoctorDto, user: IUser) {
    const IsExist = await this.doctorModel.findOne({
      userID: createdoctorDto.userID,
    });
    if (IsExist) {
      throw new BadRequestException('DoctorId đã tồn tại');
    }

    const doctor = await this.doctorModel.create({
      ...createdoctorDto,
      createdBy: {
        // _id: user._id,
        // email: user.email,
      },
    });
    return {
      createdBy: {
        // _id: user._id,
        // email: user.email,
      },
      createdAt: doctor.createdAt,
    };
  }

  findAll() {
    return this.doctorModel.find().populate({
      path: 'userID',
      select: 'name phone',
    });
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Doctor with id=${id}`);
    }
    return this.doctorModel.findOne({ _id: id }).populate({
      path: 'userID',
      select: 'name phone',
    });
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto, user: IUser) {
    const fieldsToUpdate = pick(updateDoctorDto, [
      'room',
      'experiences',
      'degrees',
      'specializations',
    ]);

    return this.doctorModel.findOneAndUpdate(
      { _id: id },
      {
        ...fieldsToUpdate,
        updatedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
      { new: true },
    );
  }

  async remove(id: string, user: IUser) {
    await this.doctorModel.updateOne(
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
    return this.doctorModel.softDelete({
      _id: id,
    });
  }
}
