import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ServiceName } from 'src/enums/all_enums';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
    @Prop({ required: true, unique: true, enum: ServiceName })
    name: ServiceName;
    @Prop()
    description: string;
    @Prop({ required: true })
    price: number;

    @Prop()
    durationMinutes: number;
    @Prop({ default: true })
    isActive: boolean;
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

export const ServiceSchema = SchemaFactory.createForClass(Service);
