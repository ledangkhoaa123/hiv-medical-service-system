import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { TreatmentStatus } from 'src/enums/all_enums';
import { MedicalRecord } from 'src/medical-records/schemas/medical-record.schema';
import { PrescribedRegiment } from 'src/prescribed_regiments/schemas/prescribed_regiment.schema';
import { TestResult } from 'src/test-results/schemas/test-result.schema'

export type TreatmentDocument = HydratedDocument<Treatment>;

@Schema({ timestamps: true })
export class Treatment extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => Treatment.name
  })
  previousTreatmentID: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => PrescribedRegiment.name
  })
  prescribedRegimentID: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: () => TestResult.name,
    default: []
  })
  testResultID: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => "MedicalRecord"
  })
  medicalRecordID: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => Doctor.name,
    required: true,
  })
  doctorID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  treatmentDate: Date;

  @Prop({ type: String })
  note: string;

  @Prop({ type: Date })
  followUpDate: Date;

  @Prop({
  type: String,
  enum: TreatmentStatus,
  required: true,
  default: TreatmentStatus.ACTIVE,
})
  status: TreatmentStatus;

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

export const TreatmentSchema = SchemaFactory.createForClass(Treatment);
