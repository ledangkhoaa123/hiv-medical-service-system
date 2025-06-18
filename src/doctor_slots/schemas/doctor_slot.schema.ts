
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import e from 'express';
import mongoose, { Document, Types } from 'mongoose';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { DoctorSlotStatus } from 'src/enums/all_enums';
export type DoctorSlotDocument = DoctorSlot & Document;

@Schema({ timestamps: true }) // createdAt, updatedAt
export class DoctorSlot {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Doctor.name })
    doctorID: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    startTime: Date;
    @Prop({ required: true, default: DoctorSlotStatus.PENDING, enum: DoctorSlotStatus })
    status: DoctorSlotStatus;
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

    @Prop()
    deletedAt: Date;
}

export const DoctorSlotSchema = SchemaFactory.createForClass(DoctorSlot);

