import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsMongoId,
  IsEnum,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Operator, RegimenType, TestType } from 'src/enums/all_enums';

export class DrugRegiment {
  @IsMongoId()
  @IsNotEmpty({ message: 'Drug ID không được để trống' })
  drugId: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty({ message: 'Dosage không được để trống' })
  dosage: string;

  @IsArray()
  @IsNotEmpty({ message: 'Frequency không được để trống' })
  @IsString({ each: true })
  frequency: string[];
}
export class CriteriaDto {
  @IsEnum(TestType, {
    message: 'Test type không hợp lệ',
  })
  test_type: TestType;

  @IsString()
  @IsNotEmpty({ message: 'Operator không được để trống' })
  @IsEnum(Operator, {
    message: 'Operator chỉ nhận các giá trị: <, >, =, <=, >=, any'
  })
  operator: string;

@ValidateIf((o) => o.operator !== 'any')
@IsNotEmpty({ message: 'Value không được để trống khi operator không phải "any"' })
@Transform(({ value }) => {
  const num = parseFloat(value);
  return isNaN(num) ? value : num;
})
@ValidateIf((o) => typeof o.value === 'string')
@IsString({ message: 'Value phải là chuỗi' })
@ValidateIf((o) => typeof o.value === 'number')
@IsNumber({}, { message: 'Value phải là số' })
value?: string | number;
}

export class CreateArvRegimentDto {
  @IsNotEmpty({ message: 'Tên regiment không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Regimen type không được để trống' })
  @IsEnum(RegimenType, {
    message: 'Regimen type không hợp lệ',
  })
  regimenType: RegimenType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Tác dụng phụ không được để trống' })
  @IsString()
  sideEffects?: string;

  @IsNotEmpty({ message: 'Tiêu chí không được để trống' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriteriaDto)
  criteria: CriteriaDto[];

  @IsNotEmpty({ message: 'Drugs không được để trống' })
  @IsArray({ message: 'Drugs phải là một mảng' })
  @ValidateNested({ each: true })
  @Type(() => DrugRegiment)
  drugs: DrugRegiment[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
