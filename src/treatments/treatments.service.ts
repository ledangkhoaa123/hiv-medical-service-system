import { IsMongoId } from 'class-validator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo } from 'mongoose';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { Treatment, TreatmentDocument } from './schemas/treatment.schema';
import { IUser } from 'src/users/user.interface';

import { MedicalRecordsService } from 'src/medical-records/medical-records.service';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { MailService } from 'src/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DoctorsService } from 'src/doctors/doctors.service';
@Injectable()
export class TreatmentsService {
  constructor(
    @InjectModel(Treatment.name)
    private treatmentModel: SoftDeleteModel<TreatmentDocument>,
    private medicalRecordsService: MedicalRecordsService,
    private readonly mailService: MailService,
    private doctorsService: DoctorsService
  ) {
    const job = new CronJob(
      '0 43 10 * * *', // giây phút giờ ngày tháng thứ
      () => this.sendFollowUpReminders(),
      null,
      true,
      'Asia/Ho_Chi_Minh'
    );
    job.start();
  }

  async create(createTreatmentDto: CreateTreatmentDto, user: IUser) {
    const medicalRecord = await this.medicalRecordsService.findOne(
      createTreatmentDto.medicalRecordID.toString(),
    );
    const doctor = await this.doctorsService.findByUserID(user._id)
    if(!doctor){
      throw new BadRequestException(
        `Doctor's token không hợp lệ`,
      );
    }
    if (!medicalRecord) {
      throw new BadRequestException(
        `Không tồn tại MedicalRecord với ID ${createTreatmentDto.medicalRecordID}`,
      );
    }
    const treatment = await this.treatmentModel.create({
      ...createTreatmentDto,
      doctorID: doctor.id,
      createdBy: { _id: user._id, email: user.email },
    });
    this.medicalRecordsService.updateTreatmentId(
      createTreatmentDto.medicalRecordID,
      treatment._id as any,
    );
    return treatment;
  }
  async findAll() {
    return this.treatmentModel.find().populate([
      {
        path: 'testResultID',
        select: { _id: 1, test_type: 1, test_results: 1, test_date: 1 },
      },
      { path: 'prescribedRegimentID', select: '_id' },
      { path: 'previousTreatmentID', select: '_id' },
      { path: 'doctorID', select: '_id' },
    ]);
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
    }
    const treatment = await this.treatmentModel.findOne({ _id: id }).populate([
      {
        path: 'testResultID',
        select: '_id, test_type, test_results, test_date',
      },
      { path: 'prescribedRegimentID', select: '_id' },
      { path: 'previousTreatmentID', select: '_id' },
      { path: 'doctorID', select: '_id' },
    ]);
    return treatment;
  }
  async update(
    id: string,
    updateTreatmentDto: UpdateTreatmentDto,
    user: IUser,
  ) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
    }

    return this.treatmentModel.updateOne(
      { _id: id },
      {
        ...updateTreatmentDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
    }
    await this.treatmentModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.treatmentModel.softDelete({
      _id: id,
    });
  }
  updateTestResultId = async (
    treatmentId: mongoose.Schema.Types.ObjectId,
    testResultId: mongoose.Schema.Types.ObjectId,
  ) => {
    const record = await this.findOne(treatmentId as any);
    if (record) {
      return await this.treatmentModel.updateOne(
        { _id: record._id },
        { $addToSet: { testResultID: testResultId } },
      );
    }
  };
  updatePrescribedRegimentID = async (
    treatmentId: mongoose.Schema.Types.ObjectId,
    prescribedId: mongoose.Schema.Types.ObjectId,
  ) => {
    const record = await this.findOne(treatmentId as any);
    if (record) {
      return await this.treatmentModel.updateOne(
        { _id: record._id },
        { prescribedRegimentID: prescribedId },
      );
    }
  };


  async sendFollowUpReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const treatments = await this.treatmentModel.find({
      followUpDate: { $gte: tomorrow, $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) },
      isDeleted: false,
    }).populate({
      path: 'medicalRecordID',
      populate: { path: 'patientID' }
    })
      .populate({
        path: 'doctorID',
        select: 'userID room',
        populate: { path: 'userID', select: 'name' }
      });
    for (const treatment of treatments) {
      const medicalRecord: any = treatment.medicalRecordID;
      const patient: any = medicalRecord?.patientID;
      const doctor: any = treatment.doctorID;
      const date = new Date(treatment.followUpDate)
      const vietnamDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
      const yyyy = vietnamDate.getFullYear();
      const mm = String(vietnamDate.getMonth() + 1).padStart(2, '0');
      const dd = String(vietnamDate.getDate()).padStart(2, '0');
      const hh = String(vietnamDate.getHours()).padStart(2, '0');
      const min = String(vietnamDate.getMinutes()).padStart(2, '0');
      const formatted = `${dd}/${mm}/${yyyy} ${hh}:${min}`;
      await this.mailService.sendFollowUpReminderEmail({
        to: patient.contactEmails?.[0],
        patientName: patient.name || 'Quý khách',
        doctorName: doctor?.userID?.name || '',
        room: doctor?.room || '',
        followUpDate: formatted
      });
    }
  }
}
