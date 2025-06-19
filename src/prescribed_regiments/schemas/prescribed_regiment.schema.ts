import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ArvRegiment } from 'src/arv_regiments/schemas/arv_regiment.schema';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { Treatment } from 'src/treatments/schemas/treatment.schema';

@Schema({ timestamps: true })
export class PrescribedRegiment extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: ArvRegiment.name,
    required: true,
  })
  baseRegimentID: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Doctor.name,
    required: true,
  })
  prescribedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, required: true })
  prescribedDate: Date;

  @Prop()
  customDrugs: {
    _id: mongoose.Schema.Types.ObjectId;
    dosage: string;
    frequency: string[];
  }[];

  @Prop({ type: Date })
  endDate: Date;

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

export const PrescribedRegimentSchema =
  SchemaFactory.createForClass(PrescribedRegiment);
