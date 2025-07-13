import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNotEmpty, Matches } from 'class-validator';
import mongoose from 'mongoose';

export class CreateAnonymousAppointmentDto {

  @ApiProperty({
    example: '2025-07-15',
    description: 'Ngày hẹn theo định dạng YYYY-MM-DD',
  })
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateString phải theo định dạng YYYY-MM-DD',
  })
  dateString: string;

  @ApiProperty({
    example: '14:30',
    description: 'Giờ hẹn theo định dạng HH:mm',
  })
  @IsNotEmpty()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: 'timeString phải theo định dạng HH:mm',
  })
  timeString: string;
}
