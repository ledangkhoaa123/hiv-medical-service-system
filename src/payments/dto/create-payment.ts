import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreatePaymentDto {
    @IsNotEmpty({ message: 'appointmentID không được trống' })
    @IsMongoId({ message: 'appointmentID có định dạng là MongoID' })
    @ApiProperty({
        example: '',
        description: 'appointmentID',
      })
    appointmentID: string;
}