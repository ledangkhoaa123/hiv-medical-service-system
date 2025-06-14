import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DrugGroup } from 'src/enums/all_enums';

export class CreateArvDrugDto {
  @IsNotEmpty({ message: 'Tên thuốc không được để trống' })
  @IsString()
  genericName: string;

  @IsNotEmpty({ message: 'Nhà cung cấp không được để trống' })
  @IsString()
  manufacturer: string;

  @IsArray({ message: 'Group phải là một mảng' })
  @ArrayNotEmpty({ message: 'Group không được để trống' })
  @IsEnum(DrugGroup, { each: true, message: 'Group chỉ nhận các giá trị hợp lệ' })
  group: DrugGroup[];
}