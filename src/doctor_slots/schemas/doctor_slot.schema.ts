
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
export type DoctorSlotDocument = DoctorSlot & Document;

@Schema({ timestamps: true }) // createdAt, updatedAt
export class DoctorSlot {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: Doctor.name })
    doctorID: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    date: Date;

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

    @Prop()
    deletedAt: Date;
}

export const DoctorSlotSchema = SchemaFactory.createForClass(DoctorSlot);

