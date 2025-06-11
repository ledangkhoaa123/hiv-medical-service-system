import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class DrugDto {
  @IsMongoId()
  _id: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsArray()
  @IsString({ each: true })
  frequency: string[];
}

export class CreateArvRegimentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  regimenType: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  sideEffects?: string;

  @IsNotEmpty()
  criteria?: Record<string, any>;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DrugDto)
  drugs?: DrugDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
