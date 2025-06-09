import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateDoctorDto {
    @IsNotEmpty({ message: 'userID không được trống' })
    @IsMongoId({ message: 'userID phải là ObjectId hợp lệ' })
    userID: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'room không được trống' })
    room: string;
    @IsNotEmpty({ message: 'Experiences không được để trống' })
    @IsArray({ message: 'Experiences phải là mảng' })
    @IsString({ each: true, message: 'Mỗi phần tử trong Experiences phải là chuỗi' })
    experiences: string[];

    @IsOptional()
    @IsString({ message: 'specializations phải là chuỗi' })
    degrees: string;
    @IsOptional()
    @IsString({ message: 'specializations phải là chuỗi' })
    specializations: string;

}
