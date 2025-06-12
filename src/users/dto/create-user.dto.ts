import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  dob: Date;
  @IsNotEmpty({ message: 'Address không được trống' })
  address: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty({ message: 'Role không được trống' })
  @IsMongoId({ message: 'Role có định dạng là MongoID' })
  role: mongoose.Schema.Types.ObjectId;
}
export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không đưọc trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không đưuọc trống' })
  password: string;

  @IsNotEmpty({ message: 'Age không được trống' })
  @IsDateString({}, { message: 'Định dạng ngày tháng không hợp lệ' })
  dob: Date;

  @IsNotEmpty({ message: 'gender không được trống' })
  gender: string;

  @IsNotEmpty({ message: 'Address không được trống' })
  address: string;

  @IsNotEmpty()
  phone: string;
}
export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'test1@gmail.com', description: 'email' })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  readonly password: string;
}
