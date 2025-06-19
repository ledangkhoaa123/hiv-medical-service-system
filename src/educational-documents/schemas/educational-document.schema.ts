import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type EducationalDocumentDocument = EducationalDocument & Document;

@Schema({ timestamps: true })
export class EducationalDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  fileURL?: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: mongoose.Schema.Types.ObjectId;

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

export const EducationalDocumentSchema =
  SchemaFactory.createForClass(EducationalDocument);
