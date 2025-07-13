import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AppointmentStatus } from 'src/enums/all_enums';
import { Patient } from 'src/patients/schemas/patient.schema';
import { Service } from 'src/services/schemas/service.schema';

export type AnonymousAppointmentDocument = AnonymousAppointment & Document;
@Schema({ timestamps: true }) // createdAt, updatedAt
export class AnonymousAppointment {
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true })
  rawDate: string; // ví dụ: '2025-07-15'

  @Prop({ required: true })
  rawTime: string; // ví dụ: '13:30'
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Patient.name,
    required: true,
  })
  patientID: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: String,
    required: true,
    default: AppointmentStatus.pending,
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Service.name,
    required: true,
    default: '6870cc1473c40186ff8ef906',
  })
  serviceID: mongoose.Schema.Types.ObjectId;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const AnonymousAppointmentSchema =
  SchemaFactory.createForClass(AnonymousAppointment);
