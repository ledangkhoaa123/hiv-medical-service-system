/* eslint-disable prefer-const */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import ms from 'ms';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/users/schemas/user.schema';
import { RoleName } from 'src/enums/all_enums';
import { MailService } from 'src/mail/mail.service';
import { RolesService } from 'src/roles/roles.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService,
    private mailService: MailService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user && await this.usersService.isValidPassword(pass, user.password)) {
      const userRole = user.role as unknown as { _id: string; name: string };
      const tempRole = await this.rolesService.findOne(userRole._id);

      const objUser = {
        ...user.toObject(),
        permissions: tempRole?.permissions ?? [],
      };
      return objUser;
    }
    return null;
  }

  async signIn(user: IUser, res: Response) {
    if (user.role.name === RoleName.CUSTOMER_ROLE && !user.isVerified) {
      throw new BadRequestException('Tài khoản chưa xác thực email!');
    }
    const { _id, email, name, role, permissions, address, gender, avatarURL } = user;
    const payload = {
      iss: 'Form Server',
      sub: 'Token Login',
      _id,
      name,
      address,
      gender,
      email,
      avatarURL,
      role
    };
    const refreshToken = this.createRefreshToken({ name: name });
    //Update refreshToken in DB
    this.usersService.updateUserRefreshToken(refreshToken, _id);
    res.cookie('refresh_Token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        address,
        gender,
        avatarURL,
        role,
        permissions,
      },
    };
  }
  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refreshToken;
  };
  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      let user = await this.usersService.findUserByRefreshToken(refreshToken);
      if (user) {
        //update refresh Token
        const { _id, email, name } = user;
        const payload = {
          iss: 'Form Server',
          sub: 'Token Login',
          _id,
          name: name,
          email,
        };

        const refreshToken = this.createRefreshToken({ name: name });
        //Update refreshToken in DB
        this.usersService.updateUserRefreshToken(refreshToken, _id.toString());

        const userRole = user.role as unknown as { _id: string; name: string };
        const tempRole = await this.rolesService.findOne(userRole._id);

        //Xóa cho chắc thui
        response.clearCookie('refresh_Token');

        //Gán refreshtoken vào cookies
        response.cookie('refresh_Token', refreshToken, {
          httpOnly: true,
          maxAge:
            ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) * 1000,
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            email,
            name,
            role: userRole as any,
            permissions: tempRole?. permissions ?? []
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh token không hợp lệ, Login lại đê',
        );
      }
    } catch (error) {
      throw new BadRequestException('Refresh token không hợp lệ, Login lại đê');
    }
  };
  logout = async (response: Response, user: IUser) => {
    this.usersService.updateUserRefreshToken('', user._id);
    response.clearCookie('refresh_Token');
    return 'Ok';
  };
  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      await this.usersService.verifyUser(payload.userId);
      return { message: 'Xác thực email thành công!' };
    } catch (e) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Email không tồn tại');
    const token = this.jwtService.sign(
      { userId: user._id },
      { expiresIn: '15m' }
    );
    const port = this.configService.get<string>('PORT');
    const resetLink = `http://localhost${port}/auth/reset-password?token=${token}`;
    await this.mailService.sendResetPasswordEmail({ to: email, resetLink });
    return { message: 'Đã gửi email đặt lại mật khẩu!' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      const hashPassword = this.usersService.getHashPassword(newPassword);
      await this.userModel.updateOne(
        { _id: payload.userId },
        { password: hashPassword }
      );
      return { message: 'Đặt lại mật khẩu thành công!' };
    } catch (e) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
  async changePassword(users: IUser, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findByEmail(users.email);
    const isMatch = await this.isValidPassword(
      oldPassword,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }
    const hashPassword = this.usersService.getHashPassword(newPassword);
    await this.userModel.updateOne(
      { _id: user._id },
      { password: hashPassword },
    );

    return { message: 'Đổi mật khẩu thành công!' };
  }
  async isValidPassword(inputPass: string, dbPass: string): Promise<boolean> {
    if (!inputPass || !dbPass) {
      return false;
    }
    return bcrypt.compare(inputPass, dbPass);
  }
}
