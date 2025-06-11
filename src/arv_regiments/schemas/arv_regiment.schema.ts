import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ArvRegiment extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  regimenType: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  sideEffects: string;

  @Prop({ type: Object })
  criteria: Record<string, any>;

  @Prop()
  drugs: {
    _id: mongoose.Schema.Types.ObjectId;
    dosage: string;
    frequency: string[];
  }[];

  @Prop({ type: Boolean, default: true })
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

export const ArvRegimentSchema = SchemaFactory.createForClass(ArvRegiment);
