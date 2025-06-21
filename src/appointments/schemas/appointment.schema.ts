import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { DoctorSlot } from 'src/doctor_slots/schemas/doctor_slot.schema';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { AppointmentStatus } from 'src/enums/all_enums';
import { MedicalRecord } from 'src/medical-records/schemas/medical-record.schema';
import { Patient } from 'src/patients/schemas/patient.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Treatment } from 'src/treatments/schemas/treatment.schema';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Doctor.name, required: true })
    doctorID: mongoose.Schema.Types.ObjectId;
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => DoctorSlot.name, required: true })
    doctorSlotID: mongoose.Schema.Types.ObjectId[];
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Patient.name, required: true })
    patientID: mongoose.Schema.Types.ObjectId;
    @Prop({ required: true })
    date: Date;
    @Prop({
        type: String, required: true, default: AppointmentStatus.pending_payment, enum: AppointmentStatus
    })
    status: AppointmentStatus;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Service.name,
        required: true,
    })
    serviceID: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: MedicalRecord.name })
    medicalRecordID?: mongoose.Schema.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Treatment.name })
    treatmentID?: mongoose.Schema.Types.ObjectId;
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: () => "Appointment" })
    extendTo?: mongoose.Schema.Types.ObjectId[];
    @Prop({ required: true })
    startTime: Date;


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

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
