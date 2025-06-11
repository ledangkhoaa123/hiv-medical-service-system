import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArvDrugDto {
  @IsNotEmpty()
  @IsString()
  drug_code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString({ each: true })
  group: string[];
}