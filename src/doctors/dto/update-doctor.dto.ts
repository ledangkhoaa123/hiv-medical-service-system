import { PartialType } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsOptional()
  room: string;

  @IsOptional()
  @IsArray({ message: 'Experiences phải là mảng' })
  @IsString({
    each: true,
    message: 'Mỗi phần tử trong Experiences phải là chuỗi',
  })
  experiences: string[];

  @IsOptional()
  @IsString({ message: 'degrees phải là chuỗi' })
  degrees: string;
  @IsOptional()
  @IsString({ message: 'specializations phải là chuỗi' })
  specializations: string;
  @IsOptional()
  @IsString({ message: 'name phải là chuỗi' })
  name: string;
}
