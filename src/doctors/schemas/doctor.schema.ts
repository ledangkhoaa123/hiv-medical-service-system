import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: User.name })
  userID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  room: string;

  @Prop()
  experiences: string[];

  @Prop()
  degrees: string;

  @Prop()
  specializations: string;

  @Prop({ default: true })
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

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
