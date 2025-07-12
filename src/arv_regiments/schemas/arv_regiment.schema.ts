import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { ArvDrug } from 'src/arv_drugs/schemas/arv_drug.schema';
import { Operator, RegimenType, TestType } from 'src/enums/all_enums';

export type ArvRegimentDocument = HydratedDocument<ArvRegiment>;

@Schema({ timestamps: true })
export class ArvRegiment extends Document {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, enum: RegimenType, required: true })
  regimenType: RegimenType;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  sideEffects: string;

 @Prop({ type: [{
      test_type: { type: String, enum: TestType, required: true },
      operator: { type: String, enum: Operator, required: true },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    }], default: [] })
  criteria: {
    test_type: TestType;
    operator: Operator;
    value: number | string; 
  }[];

  @Prop([{
  drugId: { type: mongoose.Schema.Types.ObjectId, ref: () => ArvDrug.name, required: true },
  dosage: { type: String, required: true },
  frequency: { type: [String], required: true },
}])
  drugs: {
    drugId: mongoose.Schema.Types.ObjectId;
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
