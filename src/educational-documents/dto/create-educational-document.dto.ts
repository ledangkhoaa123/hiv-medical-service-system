import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateEducationalDocumentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsUrl({}, { message: 'fileURL phải là URL hợp lệ' })
  fileURL: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}

