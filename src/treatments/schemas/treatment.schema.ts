import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { MedicalRecord } from 'src/medical-records/schemas/medical-record.schema';
import { PrescribedRegiment } from 'src/prescribed_regiments/schemas/prescribed_regiment.schema';
import { TestResult } from 'src/test-results/schemas/test-result.schema';

@Schema({ timestamps: true })
export class Treatment extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Treatment.name,
  })
  previousTreatmentID: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: PrescribedRegiment.name,
  })
  prescribedRegimentID: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: TestResult.name,
  })
  testResultID: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Doctor.name,
    required: true,
  })
  doctorID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, required: true })
  treatmentDate: Date;

  @Prop({ type: String })
  note: string;

  @Prop({ type: Date })
  followUpDate: Date;

  @Prop({ type: String, required: true, default: 'active' })
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

  @Prop()
  deletedAt: Date;
}

export const TreatmentSchema = SchemaFactory.createForClass(Treatment);
