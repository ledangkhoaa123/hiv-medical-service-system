import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateDoctorDto extends CreateUserDto {

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
