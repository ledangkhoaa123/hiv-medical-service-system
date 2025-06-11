import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { Patient } from 'src/patients/schemas/patient.schema';
import { Service } from 'src/services/schemas/service.schema';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Doctor.name, required: true })
    doctorID: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Patient.name, required: true })
    patientId: mongoose.Schema.Types.ObjectId;
    @Prop({ required: true })
    date: Date;
    @Prop({
        type: String, required: true, enum: [
            'pending_payment',
            'paid_pending_approval',
            'confirmed',
            'payment_failed',
            'cancelled_by_user',
            'cancelled_by_staff_refund_required',
            'cancelled_by_staff_refunded',
            'completed']
    })
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Service.name, required: true })
    serviceID: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' })
    medicalRecord: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Appointment.name })
    extendTo: mongoose.Schema.Types.ObjectId[];
    @Prop({ required: true })
    startTime: Date;

    @Prop()
    endTime: Date;
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

}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
