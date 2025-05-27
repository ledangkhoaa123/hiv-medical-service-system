import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { log, profile } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const isExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    const { email, password, dob, gender, name, phone, address } =
      createUserDto;
    const hashPassword = this.getHashPassword(password);
    const user = await this.userModel.create({
      email,
      password: hashPassword,
      dob,
      gender,
      name,
      phone,
      address,
    });
    return {
      user: {
        _id: user._id,
        _name: user.name,
      },
    };
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
        createAt: user.createdAt 
      }
    }
  }
  findAll() {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
