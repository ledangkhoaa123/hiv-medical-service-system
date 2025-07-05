import { ConfigService } from '@nestjs/config';
import { pick } from 'lodash';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUserDto,
  RegisterUserDto,
  UpgradeUserDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import mongoose from 'mongoose';
import { IUser } from './user.interface';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { PatientsService } from 'src/patients/patients.service';
import {
  CreatePatientDto,
  UpgradeFromGuestDto,
} from 'src/patients/dto/create-patient.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    private patientService: PatientsService,
  ) {}
  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    if (!(await this.roleModel.findOne({_id: createUserDto.role})) || !createUserDto.role) {
      throw new NotFoundException("Không tìm thấy role")
    }
    const { email, password, dob, gender, name, phone, address, role } =
      createUserDto;
    const hashPassword = this.getHashPassword(password);
    const createdBy = pick(user, ['email', 'name']);
    try {
      const user = await this.userModel.create({
        email,
        password: hashPassword,
        name,
        gender,
        dob,
        phone,
        address,
        createdBy,
        role,
      });
      return {
        user: {
          _id: user._id,
          name: user.name,
          createAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `${email} đã tồn tại, vui lòng sử dụng email khác`,
        );
      }
    }
  }
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  async isValidPassword(password: string, hashPassword: string) {
    const status = await compareSync(password, hashPassword);
    return status;
  }
  async register(registerUserDTO: RegisterUserDto) {
    const { email, password } = registerUserDTO;
    const { name, gender, dob, phone, address } = registerUserDTO;
    //const profile = { name, gender, dob, phone };
    const hashPassword = this.getHashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        `${email} đã tồn tại, vui lòng sử dụng email khác`,
      );
    }
    //Hard CODE
    const userRole = await this.roleModel.findOne({ name: 'CUSTOMER_ROLE' });
    if (!userRole) {
      throw new BadRequestException('Không tìm thấy role');
    }
    if (
      await this.patientService.findOneByPersonalID(registerUserDTO.personalID)
    ) {
      throw new BadRequestException('Personal ID đã tồn tại');
    }
    try {
      const user = await this.userModel.create({
        email,
        password: hashPassword,
        name,
        gender,
        dob,
        phone,
        address,
        role: userRole,
      });
      const patient: CreatePatientDto = {
        personalID: registerUserDTO.personalID,
        userID: user._id as any,
        isRegistered: true,
        contactEmails: registerUserDTO.email ? [registerUserDTO.email] : [],
        contactPhones: registerUserDTO.phone ? [registerUserDTO.phone] : [],
        wallet: 0,
        name,
        gender,
        dob,
      };
      await this.patientService.createCustomer(patient);
      return {
        user: {
          _id: user._id,
          name: user.name,
          createAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `${email} đã tồn tại, vui lòng sử dụng email khác`,
        );
      }
      if (!userRole) {
        throw new BadRequestException('Không tìm thấy role');
      }
    }
  }

  async upgradeFromGuest(upgradeDTO: UpgradeFromGuestDto) {
    const { email, password, personalID } = upgradeDTO;
    const isExist = await this.userModel.findOne({
      email: email,
    });

    if (isExist) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    const patient = await this.patientService.findOneByPersonalID(personalID);
    if (!patient) {
      throw new BadRequestException(
        `Không tìm thấy bệnh nhân với personalID=${personalID}`,
      );
    }
    const hashPassword = this.getHashPassword(password);

    const userDto: UpgradeUserDto = {
      email,
      password: hashPassword,
      name: patient.name,
      gender: patient.gender,
      dob: patient.dob,
    };
    const user = await this.userModel.create({
      ...userDto,
    });
    await this.patientService.updateUserID(personalID, user._id as any, email);
    return {
      user: {
        _id: user._id,
        email: user.email,
        createAt: user.createdAt,
      },
    };
  }
  findAll() {
    return this.userModel
      .find()
      .select('-password')
      .populate({
        path: 'role',
        select: { name: 1 },
      });
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID người dùng không tồn tại');
    }
    return await this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({
      email: username,
    });
    // .populate({
    //   path: 'role',
    //   select: { name: 1},
    // });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const updatedBy = pick(user, ['_id', 'email']);
    if (!(await this.findOne(id))) {
      throw new BadRequestException('ID người dùng không tồn tại');
    }
    if (await this.findByEmail(updateUserDto.email)) {
      throw new BadRequestException(
        `${updateUserDto.email} đã tồn tại, vui lòng sử dụng email khác`,
      );
    }

    return this.userModel.updateOne(
      { _id: id },
      { ...updateUserDto, updatedBy },
    );
  }

  async remove(id: string, userDelete: IUser) {
    const user = await this.userModel.findOne({
      _id: id,
    });
    if (!user) {
      throw new BadRequestException('Không có id hoặc sai id người xóa');
    }
    // if (user.email === this.ConfigService.get<string>('ADMIN_EMAIL')) {
    //   throw new BadRequestException(`Không thể xóa email này : ${user.email}`);
    // }
    const deletedBy = { _id: userDelete._id, email: userDelete.email };
    await this.userModel.updateOne({ _id: id }, { deletedBy: deletedBy });
    return this.userModel.softDelete({
      _id: id,
    });
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).populate({
      path: 'role',
      select: { name: 1 },
    });
  }

  updateUserRefreshToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }).populate({
      path: 'role',
      select: { name: 1 },
    });
  };
  findUserByPersonalID = async (personalId: string) => {
    return await this.userModel.findOne({ personalID: personalId }).populate({
      path: 'role',
      select: { name: 1 },
    });
  };
}
