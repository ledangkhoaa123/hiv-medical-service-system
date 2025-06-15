import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateServiceDto {
    @IsString({ message: "Name phải là string" })
    @IsNotEmpty({ message: "Name khong được để trống" })
    name: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsNumber()
    @Min(15)
    durationMinutes: number;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
