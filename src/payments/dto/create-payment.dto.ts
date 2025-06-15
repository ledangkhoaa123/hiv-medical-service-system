import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreatePaymentDto {
    @IsMongoId()
    @IsNotEmpty({ message: 'AppointmentID không được để trống' })
    appointmentID: string;

    @IsMongoId()
    @IsOptional()
    anonymousAppointmentID: string;

    @IsMongoId()
    @IsOptional()
    patientId: string;

    @IsNotEmpty({ message: 'Amount không được để trống' })
    @IsNumber()
    amount: number;

    @IsString()
    @IsOptional()
    currency: string = 'VND';

    @IsString()
    @IsNotEmpty()
    paymentMethod: string;
    @IsNotEmpty({ message: 'TransactionID không được để trống' })
    @IsString()
    transactionID: string;

    @IsNotEmpty({ message: 'Status không được để trống' })
    @IsString()
    status: string = 'pending';

    @IsDateString()
    @IsNotEmpty({ message: 'PaymentDate không được để trống' })
    paymentDate: string;

    @IsString()
    @IsOptional()
    notes: string;

    @IsNumber()
    @IsOptional()
    refundAmount: number;

    @IsString()
    @IsOptional()
    refundTransactionID: string;

    @IsDateString()
    @IsOptional()
    refundDate: string;

    @IsString()
    @IsOptional()
    refundNotes: string;
    
}
