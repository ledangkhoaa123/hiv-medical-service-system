import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Doctor } from "src/doctors/schemas/doctor.schema";
@Schema({ timestamps: true })
export class DoctorSchedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => "Doctor", required: true })
  doctorID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  date: Date;



  @Prop({ required: true })
  shiftStart: string; // "08:00"

  @Prop({ required: true })
  shiftEnd: string; // "17:00"

  @Prop({
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'available', 'pending_hold', 'booked', 'unavailable'],
  })
  status: string;
  @Prop({ default: false })
  isConfirmed: boolean;
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
export const DoctorScheduleSchema = SchemaFactory.createForClass(DoctorSchedule);

