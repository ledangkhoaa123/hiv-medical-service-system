import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name không được trống' })
  name: string;

  @IsNotEmpty({ message: 'Discription không được trống' })
  description: string;

  @IsNotEmpty({ message: 'isActive không được trống' })
  @IsBoolean({ message: 'isActive định dạng boolean' })
  isActive: boolean;

  @IsNotEmpty({ message: 'Permissions không được trống' })
  @IsMongoId({ each: true, message: 'Each permission phải là MongoObj ID' })
  @IsArray({ message: 'Permissions phải có dạng Array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
