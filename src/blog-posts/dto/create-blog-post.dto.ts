import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBlogPostDto {
  @IsNotEmpty()
  authorID: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsString()
  @IsNotEmpty()
  status: string;
}


