/* eslint-disable prefer-const */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Response } from 'express';
import ms from 'ms';
import { RolesService } from 'src/roles/roles.service';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    const isMatch = await this.usersService.isValidPassword(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user.toObject(); // Chuyển từ momgoose document obj sang obj
      return result;
    }
    return null;
  }

  async signIn(user: any, res: Response) {
    const { _id, email, name } = user;
    const payload = {
      iss: 'Form Server',
      sub: 'Token Login',
      _id,
      name,
      email,
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

        // const userRole = user.role as unknown as { _id: string; name: string };
        // const tempRole = await this.rolesService.findOne(userRole._id);

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
            //role,
            //permissions: tempRole?. permissions ?? []
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
}
