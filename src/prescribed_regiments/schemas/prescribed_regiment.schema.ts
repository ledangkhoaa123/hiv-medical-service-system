import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { ArvDrug } from 'src/arv_drugs/schemas/arv_drug.schema';
import { ArvRegiment } from 'src/arv_regiments/schemas/arv_regiment.schema';
import { Doctor } from 'src/doctors/schemas/doctor.schema';

export type PrescribedRegimentDocument = HydratedDocument<PrescribedRegiment>;

@Schema({ timestamps: true })
export class PrescribedRegiment extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    ref: () => 'Treatment',
    required: true,
  })
  treatmentID: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
    ref: ArvRegiment.name,
    required: true,
  })
  baseRegimentID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  prescribedDate: Date;

  @Prop({type:[{
    drugId: { type: mongoose.Schema.Types.ObjectId, ref: () => ArvDrug.name },
    dosage: { type: String },
    frequency: { type: [String] },
  }], default: [] }
  )
  customDrugs: {
    drugId: mongoose.Schema.Types.ObjectId;
    dosage: string;
    frequency: string[];
  }[];

  @Prop({ type: String })
  note?: string;

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
