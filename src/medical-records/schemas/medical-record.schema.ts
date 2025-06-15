import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { Patient } from 'src/patients/schemas/patient.schema';
import { Treatment } from 'src/treatments/schemas/treatment.schema';

export type MedicalRecordDocument = HydratedDocument<MedicalRecord>;

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Treatment.name,
  })
  treatmentID: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => 'Patient',
    required: true,
  })
  patientID: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  diagnosis: string;

  @Prop({ type: String })
  symptoms: string;

  @Prop({ type: String })
  clinicalNotes: string;

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

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
