import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { MedicalRecord } from 'src/medical-records/schemas/medical-record.schema';
import { User } from 'src/users/schemas/user.schema';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true })
export class Patient {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: MedicalRecord.name,
    default: [],
  })
  medicalRecordID: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userID: User ;

  @Prop({ required: true, default: false })
  isRegistered: boolean;

  @Prop({ required: true, unique: true })
  personalID: string;

  @Prop()
  name: string;

  @Prop()
  gender: string;

  @Prop({ type: Date })
  dob: Date;

  @Prop()
  contactEmails: string[];

  @Prop()
  contactPhones: string[];

  @Prop({ default: null })
  wallet: number | null;

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

export const PatientSchema = SchemaFactory.createForClass(Patient);
