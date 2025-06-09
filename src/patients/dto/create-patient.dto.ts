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

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    dob: Date;
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
    @IsString({ each: true, message:'Mỗi phần tử phải là string' })
    contactPhones: string[];

    @ValidateIf(o => o.isRegistered === true)
    @IsNumber()
    @Min(0)
    wallet?: number;
}
export class CreateGuestPatientDto {

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9A-Z]{8,20}$/, { message: 'personalID không hợp lệ' })
    personalID: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsDateString()
    dob: Date;
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
    @IsString({ each: true, message:'Mỗi phần tử phải là string' })
    contactPhones: string[];

    @ValidateIf(o => o.isRegistered === true)
    @IsNumber()
    @Min(0)
    wallet?: number;
}