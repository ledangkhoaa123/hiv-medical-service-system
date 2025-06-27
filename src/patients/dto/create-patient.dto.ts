import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsMongoId,
  IsArray,
  ArrayUnique,
  IsEmail,
  IsNumber,
  Min,
  ValidateIf,
  Matches,
  IsDate,
  IsDateString,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsMongoId()
  userID: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9A-Z]{8,20}$/, { message: 'personalID không hợp lệ' })
  personalID: string;

  @IsBoolean()
  isRegistered: boolean;
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEmail({}, { each: true })
  contactEmails: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true, message: 'Mỗi phần tử phải là string' })
  contactPhones: string[];

  @ValidateIf((o) => o.isRegistered === true)
  @IsNumber()
  @Min(0)
  wallet?: number;
}
export class CreateGuestPatientDto {
  @IsString()
  @IsNotEmpty({ message: 'PersonalID không được trống' })
  @Matches(/^[0-9A-Z]{8,20}$/, { message: 'personalID không hợp lệ' })
  personalID: string;

  @IsString()
  @IsNotEmpty({ message: 'Họ và Tên không được trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Giới tính không được trống' })
  gender: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Ngày sinh không được trống' })
  dob: Date;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEmail({}, { each: true, message: 'Mỗi phần tử phải là string' })
  contactEmails: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true, message: 'Mỗi phần tử phải là string' })
  contactPhones: string[];
}
export class UpgradeFromGuestDto {
 @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được trống' })
  email: string;

  @IsNotEmpty({ message: 'Personal ID không được trống' })
  @Matches(/^[0-9A-Z]{8,20}$/, { message: 'personalID không hợp lệ' })
  personalID: string;

  @IsNotEmpty({ message: 'Password không được trống' })
  password: string;
}
export class PersonalIDDto {
  @IsNotEmpty({ message: 'Personal ID không được trống' })
  @Matches(/^[0-9A-Z]{8,20}$/, { message: 'personalID không hợp lệ' })
  personalID: string;

}