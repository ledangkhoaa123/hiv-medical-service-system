import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type BlogPostDocument = BlogPost & Document;

@Schema({ timestamps: true })
export class BlogPost {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  authorID: mongoose.Schema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 'pending' })
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

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
