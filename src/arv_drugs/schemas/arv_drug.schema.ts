import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { DrugGroup } from 'src/enums/all_enums';

export type ArvDrugDocument = HydratedDocument<ArvDrug>;

@Schema({ timestamps: true })
export class ArvDrug extends Document {
  @Prop({ type: String, required: true, unique: true })
  genericName: string;

  @Prop({ type: String, required: true })
  manufacturer: string;

  @Prop({
    type: [String],
    enum: DrugGroup,
    required: true,
  })
  group: DrugGroup[];

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

export const ArvDrugSchema = SchemaFactory.createForClass(ArvDrug);
