import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type PatientDocument = HydratedDocument<Patient>;

@Schema({ timestamps: true })
export class Patient {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, unique: true, default: null })
    userID: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, default: false })
    isRegistered: boolean;

    @Prop({ required: true, unique: true })
    personalID: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ type: Date, required: true })
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
