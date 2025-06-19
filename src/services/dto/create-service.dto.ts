import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Min, IsEnum } from 'class-validator';
import { ServiceName } from 'src/enums/all_enums';

export class CreateServiceDto {
 
    @IsEnum(ServiceName, { message: "Tên dịch vụ không hợp lệ" })
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
