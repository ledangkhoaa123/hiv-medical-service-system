import { IsMongoId } from 'class-validator';
import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { ConfigService } from '@nestjs/config';
import { TestResultsService } from 'src/test-results/test-results.service';
import { startOfDay } from 'date-fns';
@Injectable()
export class TreatmentsService {
  constructor(
    @InjectModel(Treatment.name)
    private treatmentModel: SoftDeleteModel<TreatmentDocument>,
    @Inject(forwardRef(() => MedicalRecordsService))
    private medicalRecordsService: MedicalRecordsService,
    private readonly mailService: MailService,
    private doctorsService: DoctorsService,
    private readonly configService: ConfigService,

    private testResultService: TestResultsService,
  ) {
    const cronTime = this.configService.get<string>('TIME_SEND_MAIL_FOLLOWUP');
    const job = new CronJob(
      cronTime,
      () => this.sendFollowUpReminders(),
      null,
      true,
      'Asia/Ho_Chi_Minh',
    );
    job.start();
  }

  async create(createTreatmentDto: CreateTreatmentDto, user: IUser) {
    const medicalRecord = await this.medicalRecordsService.findOne(
      createTreatmentDto.medicalRecordID.toString(),
    );
    const doctor = await this.doctorsService.findByUserID(user._id);
    if (!doctor) {
      throw new BadRequestException(`Doctor's token không hợp lệ`);
    }
    if (!medicalRecord) {
      throw new BadRequestException(
        `Không tồn tại MedicalRecord với ID ${createTreatmentDto.medicalRecordID}`,
      );
    }
    const { testResults } = createTreatmentDto;
    const treatment = await this.treatmentModel.create({
      ...createTreatmentDto,
      doctorID: doctor.id,
      createdBy: { _id: user._id, email: user.email },
    });
    await this.medicalRecordsService.updateTreatmentId(
      createTreatmentDto.medicalRecordID,
      treatment._id as any,
    );
    if (testResults?.length) {
      for (const tr of testResults) {
        await this.testResultService.create(
          { ...tr, treatmentID: treatment._id as any },
          user,
        );
      }
    }
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
        select: '_id test_type test_results test_date',
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
    const treatment = await this.treatmentModel.findById(id);
    if (!treatment) {
      throw new BadRequestException(`Không tìm thấy điều trị với id=${id}`);
    }

    // Nếu có followUpDate thì kiểm tra phải sau treatmentDate (so sánh theo ngày)
    if (updateTreatmentDto.followUpDate) {
      const followUp = startOfDay(new Date(updateTreatmentDto.followUpDate));
      const treatmentDay = startOfDay(new Date(treatment.treatmentDate));

      if (followUp <= treatmentDay) {
        throw new BadRequestException('Ngày tái khám phải sau ngày điều trị.');
      }
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

    const treatments = await this.treatmentModel
      .find({
        followUpDate: {
          $gte: tomorrow,
          $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
        },
        isDeleted: false,
      })
      .populate({
        path: 'medicalRecordID',
        populate: { path: 'patientID' },
      })
      .populate({
        path: 'doctorID',
        select: 'userID room',
        populate: { path: 'userID', select: 'name' },
      });
    for (const treatment of treatments) {
      const medicalRecord: any = treatment.medicalRecordID;
      const patient: any = medicalRecord?.patientID;
      const doctor: any = treatment.doctorID;
      const date = new Date(treatment.followUpDate);
      const vietnamDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
      const yyyy = vietnamDate.getFullYear();
      const mm = String(vietnamDate.getMonth() + 1).padStart(2, '0');
      const dd = String(vietnamDate.getDate()).padStart(2, '0');
      const hh = String(vietnamDate.getHours()).padStart(2, '0');
      const min = String(vietnamDate.getMinutes()).padStart(2, '0');
      const formatted = `${dd}/${mm}/${yyyy} `;
      await this.mailService.sendFollowUpReminderEmail({
        to: patient.contactEmails?.[0],
        patientName: patient.name || 'Quý khách',
        doctorName: doctor?.userID?.name || '',
        room: doctor?.room || '',
        followUpDate: formatted,
        homePage: this.configService.get<string>('FE_URL'),
      });
    }
  }
  async deleteAllByMedicalRecordId(medicalRecordId: string) {
    return this.treatmentModel.deleteMany({ medicalRecordID: medicalRecordId });
  }
}
