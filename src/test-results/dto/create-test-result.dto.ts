import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TestType } from 'src/enums/all_enums';


export class CreateTestResultDto {
  @IsNotEmpty({ message: 'Treatment ID không được để trống' })
  @IsString()
  treatmentID: string;

  @IsString()
  @IsNotEmpty({ message: 'Loại xét nghiệm không được để trống' })
  @IsEnum(TestType, {
    message: 'Loại xét nghiệm không hợp lệ',
  })
  test_type: string;

  @IsString()
  @IsNotEmpty({ message: 'Kết quả xét nghiệm không được để trống' })
  test_results: string;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;
}