import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
     private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user && user.password === pass) {
      const { password, ...result } = user.toObject();// Chuyển từ momgoose document obj sang obj
      return result;
    }
    return null;
  }

  async signIn(
    user: any,
    res: Response
  ) {
    const {_id, email, name} = user;
    const payload = {
      iss: 'Form Server',
      sub: 'Token Login',
      _id,
      name,
      email,
    };
    return {
       access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
      },
    };
  }
}
