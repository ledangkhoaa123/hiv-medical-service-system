import { IsArray, IsDate, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
    @IsNotEmpty({ message: "DoctorId không được để trống" })
    @IsMongoId({ message: "DoctorId phải là kiểu string" })
    doctorID: string;

    @IsDateString()
    date: string;
    @IsNotEmpty({ message: "Status không được để trống" })
    @IsEnum([
        'pending_payment',
        'paid_pending_approval',
        'confirmed',
        'payment_failed',
        'cancelled_by_user',
        'cancelled_by_staff_refund_required',
        'cancelled_by_staff_refunded',
        'completed'
    ])
    status: string;
    @IsNotEmpty({ message: "ServiceID không được để trống" })
    @IsMongoId()
    serviceID: string;
    @IsOptional()
    @IsMongoId({ message: "medicalRecordId không đúng" })
    medicalRecord: string;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true, message: 'Mỗi phần tử phải là MongoId hợp lệ' })
    extendTo: string[];
    @IsNotEmpty({ message: "StartTime không được để trống" })
    @IsDateString()
    startTime: string;
    @IsNotEmpty({ message: "EndTime không được để trống" })
    @IsDateString()
    endTime: string;
}
