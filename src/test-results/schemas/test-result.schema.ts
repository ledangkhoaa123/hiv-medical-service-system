import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Treatment } from 'src/treatments/schemas/treatment.schema';

@Schema({ timestamps: true })
export class TestResult extends Document {
  @Prop({ type: String })
  test_type: string;

  @Prop({ type: String })
  test_results: string;

  @Prop({ type: Date, required: true })
  test_date: Date;

  @Prop({ type: String, required: true })
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
