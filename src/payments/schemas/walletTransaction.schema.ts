import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { WalletType } from 'src/enums/all_enums';
import { MedicalRecord } from 'src/medical-records/schemas/medical-record.schema';
import { User } from 'src/users/schemas/user.schema';

export type WalletTransactionDocument = HydratedDocument<WalletTransaction>;

@Schema({ timestamps: true })
export class WalletTransaction {
   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true })
  patientID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: WalletType, default: WalletType.PAYMENT })
  type: WalletType;

  @Prop()
  reason: string;

  @Prop()
  referenceAppointmentID?: mongoose.Schema.Types.ObjectId;

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

export const WalletTransactionSchema = SchemaFactory.createForClass(WalletTransaction);
