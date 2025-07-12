import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UpdateUserDto {
 @ApiProperty({
    description: 'Email của người dùng. Sẽ không được cập nhật.',
    example: 'example@email.com',
    required: false, // Đánh dấu là không bắt buộc vì ta chặn update
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiProperty({ description: 'Họ và tên người dùng', example: 'Nguyễn Văn A' })
 @IsOptional()
   name?: string;

  @ApiProperty({ description: 'Giới tính', example: 'Male' })
  @IsOptional()
  gender?: string;

  @ApiProperty({ description: 'Ngày sinh', example: '2000-01-30' })
  @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng YYYY-MM-DD' })
 @IsOptional()
   dob?: Date;

  @ApiProperty({ description: 'Địa chỉ', example: '123 Đường ABC, Q1, TP.HCM' })
   @IsOptional()
  address: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0901234567' })
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'ID của vai trò (Role). Phải là MongoID.',
    example: '60c72b2f9b1d8c001f8e4a3c',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'Role có định dạng là MongoID' })
  role?: mongoose.Schema.Types.ObjectId;
  }
