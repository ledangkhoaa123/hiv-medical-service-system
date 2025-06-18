import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {  IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email không được trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty({ message: 'Name không được trống' })
  name: string;
  @IsNotEmpty({ message: 'Gender không được trống' })
  gender: string;
  @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng YYYY-MM-DD' })
  @IsNotEmpty()
  dob: Date;
  @IsNotEmpty({ message: 'Address không được trống' })
  address: string;
  @IsNotEmpty({ message: 'Phone không được trống' })
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

  @IsNotEmpty({ message: 'Personal ID không được trống' })
  @Matches(/^[0-9A-Z]{8,20}$/, { message: 'personalID không hợp lệ' })
  personalID: string;

  @IsNotEmpty({ message: 'Password không được trống' })
  password: string;

  @IsNotEmpty({ message: 'Age không được trống' })
  @IsDateString({}, { message: 'Định dạng ngày tháng không hợp lệ' })
  dob: Date;

  @IsNotEmpty({ message: 'gender không được trống' })
  gender: string;

  @IsOptional()
  address: string;

  @IsOptional()
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
export class UpgradeUserDto {
  @IsNotEmpty({ message: 'Name không đưọc trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được trống' })
  password: string;

  @IsNotEmpty({ message: 'Age không được trống' })
  @IsDateString({}, { message: 'Định dạng ngày tháng không hợp lệ' })
  dob: Date;

  @IsNotEmpty({ message: 'gender không được trống' })
  gender: string;

}