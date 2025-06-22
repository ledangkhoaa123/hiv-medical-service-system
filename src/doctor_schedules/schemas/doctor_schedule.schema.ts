import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Doctor } from "src/doctors/schemas/doctor.schema";
import { AppointmentShiftName, DoctorScheduleStatus } from "src/enums/all_enums";
@Schema({ timestamps: true })
export class DoctorSchedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Doctor.name, required: true })
  doctorID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: String, default: AppointmentShiftName.FullDay, required: true })
  shiftName: AppointmentShiftName; // "Sáng", "Chiều", "Full Day"
  @Prop()
  shiftStart: string; // "08:00"
  @Prop()
  shiftEnd: string; // "17:00"

  @Prop({
    type: String,
    required: true,
    default: DoctorScheduleStatus.PENDING,
    enum: DoctorScheduleStatus,
  })
  status: DoctorScheduleStatus;
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

