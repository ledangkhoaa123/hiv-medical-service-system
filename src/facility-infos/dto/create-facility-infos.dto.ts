import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFacilityInfoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  contactInfo: Record<string, any>;
}
