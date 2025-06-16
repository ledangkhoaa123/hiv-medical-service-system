import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { TestType } from 'src/enums/all_enums';


export type TestResultDocument = HydratedDocument<TestResult>;

@Schema({ timestamps: true })
export class TestResult extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => 'Treatment',
    required: true,
  })
  treatmentID: mongoose.Schema.Types.ObjectId;
  @Prop({ type: String, enum: TestType, required: true })
  test_type: string;

  @Prop({ type: String })
  test_results: number | string;

  @Prop({ type: Date, required: true, default: Date.now })
  test_date: Date;

  @Prop({ type: String, required: true, default: 'ACTIVE' })
  status: string;

  @Prop({ type: String })
  description: string;

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

export const TestResultSchema = SchemaFactory.createForClass(TestResult);
