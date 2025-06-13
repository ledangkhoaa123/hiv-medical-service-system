import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name không được trống' })
  name: string;

  @IsNotEmpty({ message: 'Discription không được trống' })
  description: string;

  @IsOptional()
  @IsMongoId({ each: true, message: 'Each permission phải là MongoObj ID' })
  @IsArray({ message: 'Permissions phải có dạng Array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
