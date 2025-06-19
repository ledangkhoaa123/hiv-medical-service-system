import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { AnonymousAppointment } from 'src/anonymous-appointments/schemas/anonymous-appointment.schema';
import { Appointment } from 'src/appointments/schemas/appointment.schema';
import { Patient } from 'src/patients/schemas/patient.schema';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Appointment.name, unique: true })
    appointmentID: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: AnonymousAppointment.name, unique: true })
    anonymousAppointmentID?: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Patient.name })
    patientId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: 'VND' })
    currency: string;

    @Prop({ required: true })
    paymentMethod: string;

    @Prop({ type: String, unique: true })
    transactionID: string;
    @Prop({
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'pending_refund', 'refunded'],
        default: 'pending',
    })
    status: string;

    @Prop({ required: true })
    paymentDate: Date;

    @Prop()
    notes: string;

    @Prop()
    refundAmount: number;

    @Prop()
    refundTransactionID: string;

    @Prop()
    refundDate: Date;

    @Prop()
    refundNotes: string;
    @Prop({ type: Object })
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

export const PaymentSchema = SchemaFactory.createForClass(Payment);
