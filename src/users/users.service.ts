import { ConfigService } from '@nestjs/config';
import { pick } from 'lodash';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { log, profile } from 'console';
import { isMongoId } from 'class-validator';
import mongoose from 'mongoose';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    const { email, password, dob, gender, name, phone, address } =
      createUserDto;
    const hashPassword = this.getHashPassword(password);
    const createdBy = pick(user, ["email","name"]);
    try {
      const user = await this.userModel.create({
        email,
        password: hashPassword,
        name,
        gender,
        dob,
        phone,
        address,
        createdBy
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
    // const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    try {
      const user = await this.userModel.create({
        email,
        password: hashPassword,
        name,
        gender,
        dob,
        phone,
        address,
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
  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID người dùng không tồn tại');
    }
    return this.userModel
      .findOne({ id })
      .select('-password')
      //.populate({ path: 'role', select: { name: 1, _id: 1 } });
  }

  async findOneByUsername(username: string) {
    return await this.userModel
      .findOne({
        email: username,
      })
      // .populate({
      //   path: 'role',
      //   select: { name: 1},
      // });
  }

 async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    const updatedBy = pick(user, ["_id","email"]);
     if (!this.findOne(id)) {
        throw new BadRequestException('ID người dùng không tồn tại');
     }
     return this.userModel.updateOne(
      {_id: id},
      {...updateUserDto, updatedBy}
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
    return await this.userModel.findOne({ email: email });
  }

  updateUserRefreshToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
    // .populate({
    //   path: 'role',
    //   select: { name: 1 },
    // });
  };
}
