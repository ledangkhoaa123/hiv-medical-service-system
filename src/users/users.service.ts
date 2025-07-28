import { ConfigService } from '@nestjs/config';
import { pick } from 'lodash';
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { RoleName } from 'src/enums/all_enums';
import { RolesService } from 'src/roles/roles.service';
import { Patient, PatientDocument } from 'src/patients/schemas/patient.schema';
import { last } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Patient.name) private patientModel: SoftDeleteModel<PatientDocument>,

    private patientService: PatientsService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly roleService: RolesService,

    private readonly configService: ConfigService,

  ) { }
  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.userModel.findOne({
      email: createUserDto.email,
    });
    const isVerified = true;
    if (isExist) {
      throw new BadRequestException('Email đã tồn tại!');
    }
    if (!(await this.roleModel.findOne({ _id: createUserDto.role })) || !createUserDto.role) {
      throw new NotFoundException("Không tìm thấy role")
    }
    const { email, password, dob, gender, name, phone, address, role, avatarURL } =
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
        isVerified,
        avatarURL
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
      const token = this.jwtService.sign(
        { userId: user._id },
        { expiresIn: this.configService.get<string>('VERIFICATION_EXPIRES_IN') }
      );
      const port = this.configService.get<string>('PORT')
      const baseUrl = this.configService.get<string>('WEB_BASE_URL') 
      const verifyLink = `${baseUrl}:${port}/auth/verify-email?token=${token}`;

      await this.mailService.sendVerifyEmail({ to: user.email, verifyLink });

      return {
        user: {
          _id: user._id,
          name: user.name,
          createAt: user.createdAt,
        },
        message: 'Đăng ký thành công, vui lòng kiểm tra email để xác thực!'
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

  // file: users.service.ts

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    // Lấy thông tin người dùng cần cập nhật

    const userToUpdate = await this.userModel.findById(id);

    if (!userToUpdate) {
      throw new NotFoundException('Không tìm thấy người dùng để cập nhật.');
    }

    const actorRoleName = user.role.name;

    const targetRoleObject = await this.roleService.findOne(userToUpdate.role as any);
    if (!targetRoleObject) {
      throw new NotFoundException('Vai trò của người dùng không hợp lệ.');
    }
    const targetRoleName = targetRoleObject.name;

    switch (actorRoleName) {
      case RoleName.ADMIN_ROLE:

        break;

      case RoleName.MANAGER_ROLE:
        if (targetRoleName === RoleName.ADMIN_ROLE || targetRoleName === RoleName.MANAGER_ROLE) {
          throw new ForbiddenException('Bạn không có quyền cập nhật người dùng có vai trò này.');
        }
        if (updateUserDto.role) {
          const newRoleObject = await this.roleService.findOne(updateUserDto.role as any);
          if (newRoleObject?.name === RoleName.ADMIN_ROLE) {
            throw new ForbiddenException('Bạn không thể gán vai trò Admin.');
          }
        }
        break;

      default:
        if (user._id !== id) {
          throw new ForbiddenException('Bạn chỉ có thể cập nhật thông tin của chính mình.');
        }
        if (updateUserDto.role && updateUserDto.role.toString() !== userToUpdate.role.toString()) {
          throw new ForbiddenException('Bạn không được phép thay đổi vai trò của mình.');
        }
        break;
    }

    const updatedUserResult = await this.userModel.updateOne({ _id: id }, { ...updateUserDto });


    const patientSetData: Partial<Patient> = {};
    if (updateUserDto.name) patientSetData.name = updateUserDto.name;
    if (updateUserDto.gender) patientSetData.gender = updateUserDto.gender;
    if (updateUserDto.dob) patientSetData.dob = updateUserDto.dob;

    const addToSetData: any = {};
    if (updateUserDto.email) {
      addToSetData.contactEmails = updateUserDto.email;
    }
    if (updateUserDto.phone) {
      addToSetData.contactPhones = updateUserDto.phone;
    }

    const updatePayload: any = {};

    if (Object.keys(patientSetData).length > 0) {
      updatePayload.$set = patientSetData;
    }
    if (Object.keys(addToSetData).length > 0) {
      updatePayload.$addToSet = addToSetData;
    }

    if (Object.keys(updatePayload).length > 0) {
      await this.patientModel.updateOne(
        { userID: id },
        updatePayload,
      );
    }
    return updatedUserResult;
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
    return await this.userModel.findOne({ email: email, isDeleted: false }).populate({
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
  async verifyUser(userId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { isVerified: true }
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCronDeleteUnverifiedUsers() {
  const twentyFourHoursAgo = new Date(Date.now() - 15 * 60 * 1000);

  const unverifiedUsers = await this.userModel.find({
    isVerified: false,
    createdAt: { $lte: twentyFourHoursAgo },
  });

  const userIds = unverifiedUsers.map(user => user._id);

  await this.patientModel.deleteMany({
    userId: { $in: userIds },
  });

  const result = await this.userModel.deleteMany({
    _id: { $in: userIds },
  });

  
}
}