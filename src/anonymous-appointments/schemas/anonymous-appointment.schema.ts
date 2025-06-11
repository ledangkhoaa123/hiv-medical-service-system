import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AnonymousAppointmentDocument = AnonymousAppointment & Document;
@Schema({ timestamps: true }) // createdAt, updatedAt
export class AnonymousAppointment {
    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    dob: Date;

    @Prop({ required: true })
    date: Date;

    @Prop()
    email: string;

    @Prop({ required: true })
    status: string;

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

export const AnonymousAppointmentSchema = SchemaFactory.createForClass(AnonymousAppointment);
