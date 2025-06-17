import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateServiceDto {
    @IsString({ message: "Name phải là string" })
    @IsNotEmpty({ message: "Name khong được để trống" })
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(15)
    durationMinutes: number;
}
