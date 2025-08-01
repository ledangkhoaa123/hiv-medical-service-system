import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import {  DoctorDocument } from './schemas/doctor.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { RoleName } from 'src/enums/all_enums';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name)
    private doctorModel: SoftDeleteModel<DoctorDocument>,

    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    private usersService: UsersService,

    private rolesService: RolesService
  ) { }
  async create(createdoctorDto: CreateDoctorDto, user: IUser) {
    const { name, email, password, phone, dob, address, gender, degrees, experiences, room, specializations } = createdoctorDto;
    const role = (await this.rolesService.findByRoleName(RoleName.DOCTOR_ROLE)).id
    if (!role) {
      throw new NotFoundException("Không tìm thấy role Doctor")
    }
    const hashPassword = this.usersService.getHashPassword(password);
    const isVeryfied = true;
    try {
      const doctorUser = await this.userModel.create({ name, email, password: hashPassword, phone, dob, address, gender, role, isVerified: isVeryfied });
      if (!doctorUser) {
        throw new BadRequestException("Khởi tạo User của doctor không thành công")
      }
      try {
        const doctor = await this.doctorModel.create({
          userID: doctorUser._id,
          degrees,
          experiences,
          room,
          specializations,
          createdBy: {
            _id: user._id,
            email: user.email,
          },
        });
        return {
          _id: doctor._id,
          createdBy: {
            _id: user._id,
            email: user.email,
          },
          createdAt: doctor.createdAt,
        };
      } catch (error) {
        if (error.code === 11000) {
          throw new BadRequestException(`UserID đã tồn tại`);
        }
      }
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${email} đã tồn tại`);
      }
    }



  }

  async findAll() {
    return await this.doctorModel.find().populate({
      path: 'userID',
      select: 'name phone email',
    });
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Doctor with id=${id}`);
    }
    return this.doctorModel.findOne({ _id: id }).populate({
      path: 'userID',
      select: 'name phone email',
    });
  }
  async findByToken(user: IUser) {
    const doctor = await this.doctorModel.findOne({userID: user._id}).populate({
      path: 'userID',
      select: 'name phone email',
    });
    if (!doctor) {
      throw new BadRequestException("Token không trả về doctor theo UserID");
    }
    return doctor;
  }


  async update(id: string, updateDoctorDto: UpdateDoctorDto, user: IUser) {
    const doctor = await this.findOne(id);
    if (!doctor) {
      throw new BadRequestException(`Not found Doctor with id=${id}`);
    }
    if(updateDoctorDto.name){
      await this.userModel.updateOne({_id: doctor.userID}, {name: updateDoctorDto.name})
    }

    return await this.doctorModel.updateOne(
      { _id: id },
      {
        ...updateDoctorDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Not found Doctor with id=${id}`);
    }
    await this.doctorModel.updateOne(
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
    return this.doctorModel.softDelete({
      _id: id,
    });
  }
  findByUserID = async (userID : string) => {
    return await this.doctorModel.findOne({userID});
  }
}