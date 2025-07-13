import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Min, IsEnum, Max } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty({ message: "Name khong được để trống" })
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(15)
    @Max(120)
    durationMinutes: number;  
}
