import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateGuestPatientDto,
  CreatePatientDto,
} from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { PrescribedRegiment } from 'src/prescribed_regiments/schemas/prescribed_regiment.schema';
import { ArvRegiment } from 'src/arv_regiments/schemas/arv_regiment.schema';
import { MedicalRecord, MedicalRecordDocument } from 'src/medical-records/schemas/medical-record.schema';
import { Treatment, TreatmentDocument } from 'src/treatments/schemas/treatment.schema';
import { ArvDrug, ArvDrugDocument } from 'src/arv_drugs/schemas/arv_drug.schema';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name)
    private patientModel: SoftDeleteModel<PatientDocument>,
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(PrescribedRegiment.name)
    private readonly prescribedRegimentModel: Model<PrescribedRegiment>,
    @InjectModel(ArvRegiment.name)
    private readonly arvRegimentModel: Model<ArvRegiment>,
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecordDocument>,
    @InjectModel(Treatment.name)
    private treatmentModel: Model<TreatmentDocument>,
    @InjectModel(ArvDrug.name)
    private arvDrugModel: Model<ArvDrugDocument>,
    private readonly mailService: MailService,
    private configService: ConfigService,
  ) { 
     const cronTime = this.configService.get<string>('TIME_SEND_MAIL_FOLLOWUP');
        const job = new CronJob(
          cronTime,
          () => this.sendMedicationReminders(),
          null,
          true,
          'Asia/Ho_Chi_Minh',
        );
        job.start();
  }
  async createCustomer(createPatientDto: CreatePatientDto) {
    const IsExist = await this.userModel.findOne({
      _id: createPatientDto.userID,
    });
    if (!IsExist) {
      throw new BadRequestException('UserID không hợp lệ');
    }
    try {
      const patient = await this.patientModel.create({
        ...createPatientDto,
      });
      return {
        _id: patient._id,
        createdAt: patient.createdAt,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`UserID hoặc personalID đã tồn tại`);
      }
    }
  }

  async createGuest(createPatientDto: CreateGuestPatientDto) {
    try {
      const patient = await this.patientModel.create({
        ...createPatientDto,
      });
      return {
        _id: patient._id,
        createdAt: patient.createdAt,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`personalID đã tồn tại`);
      }
    }
  }

  findAll() {
    return this.patientModel.find().populate([
      {
        path: 'userID',
        select: 'name phone',
      },
      {
        path: 'medicalRecordID',
        select: 'diagnosis symptoms clinicalNotes',
      },
    ]);
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found Patient with id=${id}`);
    }
    return await this.patientModel.findOne({ _id: id }).populate([
      {
        path: 'userID',
        select: 'email name phone',
      },
      {
        path: 'medicalRecordID',
        select: 'diagnosis symptoms clinicalNotes',
      },
    ]);
  }

  findOneByPersonalID = async (personalID: string) => {
    if (!personalID) {
      throw new BadRequestException('Personal ID không được để trống');
    }
    const patient = await this.patientModel.findOne({
      personalID: personalID,
    });
    return patient;
  };

  async update(id: string, updatePatientDto: UpdatePatientDto, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy bệnh nhân với id=${id}`);
    }

    const isExist = await this.patientModel.findOne({
      _id: { $ne: id },
      personalID: updatePatientDto.personalID,
    });
    if (isExist) {
      throw new BadRequestException(`Personal ID đã tồn tại`);
    }

    return this.patientModel.updateOne(
      { _id: id },
      {
        ...updatePatientDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
  updateContactInfo = async (
    id: string,
    updatePatientDto: UpdatePatientDto,
    user: IUser,
  ) => {
    const patient = await this.findOne(id);
    if (!patient) {
      throw new BadRequestException(`Not found Patient with id=${id}`);
    }

    const { contactEmails, contactPhones } = updatePatientDto;

    if (contactEmails && contactEmails.length > 0) {
      const isExist = await this.patientModel.findOne({
        _id: { $ne: id },
        contactEmails: { $in: contactEmails },
      });
      if (isExist) {
        throw new BadRequestException(`Email đã được sử dụng`);
      }
    }

    if (contactPhones && contactPhones.length > 0) {
      const isExist = await this.patientModel.findOne({
        _id: { $ne: id },
        contactPhones: { $in: contactPhones },
      });
      if (isExist) {
        throw new BadRequestException(`Số điện thoại đã được sử dụng`);
      }
    }

    const updateQuery: any = {
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    };
    if (contactEmails && contactEmails.length > 0) {
      updateQuery.$addToSet = { contactEmails: { $each: contactEmails } };
    }
    if (contactPhones && contactPhones.length > 0) {
      updateQuery.$addToSet = updateQuery.$addToSet || {};
      updateQuery.$addToSet.contactPhones = { $each: contactPhones };
    }

    return this.patientModel.updateOne({ _id: id }, updateQuery);
  };

  async remove(id: string, user: IUser) {
    if (!(await this.findOne(id))) {
      throw new BadRequestException(`Không tìm thấy bệnh nhân với id=${id}`);
    }
    await this.patientModel.updateOne(
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
    return this.patientModel.softDelete({
      _id: id,
    });
  }
  updateMedicalRecord = async (
    id: mongoose.Schema.Types.ObjectId,
    newMedicalRecordID: mongoose.Schema.Types.ObjectId,
  ) => {
    const patient = await this.findOne(id.toString());
    if (!patient) {
      throw new BadRequestException(`Không tìm thấy bệnh nhân với id=${id}`);
    }
    return this.patientModel.updateOne(
      { _id: id },
      { $addToSet: { medicalRecordID: newMedicalRecordID } }, // dùng $push nếu muốn cho phép trùng lặp
    );
  };
  updateUserID = async (
    personalID: string,
    userID: mongoose.Schema.Types.ObjectId,
    email: string,
  ) => {
    const patient = await this.findOneByPersonalID(personalID);
    const userPatient = await this.patientModel.findOne({
      userID: userID,
    });
    if (!patient) {
      throw new BadRequestException(
        `Không tìm thấy bệnh nhân với personalID=${personalID}`,
      );
    }
    if (userPatient) {
      throw new BadRequestException(
        `UserID đã được sử dụng cho bệnh nhân khác`,
      );
    }
    return this.patientModel.updateOne(
      { _id: patient._id },
      {
        userID: userID,
        isRegistered: true,
        $addToSet: {
          contactEmails: email,
        },
      },
    );
  };
  findOneByToken = async (user: IUser) => {
    return this.patientModel.findOne({ userID: user._id });
  };
  updateMinorWallet = async (id: string, amount: number) => {
    const patient = await this.findOne(id);
    if (!patient) {
      throw new NotFoundException('Không tìm thấy patient');
    }
    if (typeof patient.wallet !== 'number' || patient.wallet < amount) {
      throw new BadRequestException('Số dư không đủ');
    }
    return await this.patientModel.updateOne(
      { _id: id },
      { $inc: { wallet: -amount } },
    );
  };
  async findOneByContactEmail(email: string) {
    return await this.patientModel.findOne({
      contactEmails: email
    });
  }

  refundWallet = async (id: string, amount: number) => {
    const patient = await this.findOne(id);
    if (!patient) {
      throw new NotFoundException('Không tìm thấy patient');
    }
    if (typeof patient.wallet !== 'number') {
      throw new BadRequestException('Ví chưa khởi tạo hoặc không hợp lệ');
    }
    if (amount <= 0) {
      throw new BadRequestException('Số tiền hoàn không hợp lệ');
    }
    return await this.patientModel.updateOne(
      { _id: id },
      { $inc: { wallet: amount } },
    );
  };
  async removeMedicalRecordFromPatient(patientId: string, medicalRecordId: string) {
    return await this.patientModel.updateOne(
      { _id: patientId },
      { $pull: { medicalRecordID: medicalRecordId } },
    );
  }
  async sendMedicationReminders() {
    const patients = await this.patientModel.find({ isDeleted: false, medicalRecordID: { $exists: true, $not: { $size: 0 } } }).
      populate({
        path: 'userID',
        select: 'email name',
      });

    for (const patient of patients) {
      if (!patient.userID) {
        continue; 
      }
      const user = patient.userID as User;
      const lastMedicalRecordId = patient.medicalRecordID[patient.medicalRecordID.length - 1];

      const medicalRecord = await this.medicalRecordModel.findOne({ _id: lastMedicalRecordId, isDeleted: false });
      if (!medicalRecord) {
        continue; 
      }
      const treatments = await this.treatmentModel.find({ _id: { $in: medicalRecord.treatmentID }, isDeleted: false });
      
      if (treatments.length === 0) {
        continue; 
      }
      const treatment = treatments[0];
      let drugsForEmail: { drugName: string; dosage: string; frequency: string }[] = [];

     
        const prescribedRegiment = await this.prescribedRegimentModel
          .findById(treatment.prescribedRegimentID)
        if (!prescribedRegiment) {
          continue; 
        }
        const baseArv = await this.arvRegimentModel.find({ _id: prescribedRegiment.baseRegimentID })
        const baseDrugs = baseArv.map(arv => arv.drugs).flat();
        const customDrugs = prescribedRegiment.customDrugs || [];

        const allDrugs = [...baseDrugs, ...customDrugs];
        for (const drug of allDrugs) {
          const drugInfo = await this.arvDrugModel.findById(drug.drugId);
          drugsForEmail.push({ drugName: drugInfo.genericName, dosage: drug.dosage, frequency: drug.frequency[0] });
        }
      if (drugsForEmail.length > 0) {
        await this.mailService.sendRemindMedicalEmail({
          to: user.email,
          patientName: user.name,
          drugs: drugsForEmail
        });
        console.log(`Gửi nhắc nhở đến ${user.name} (${user.email}) với ${drugsForEmail.length} loại thuốc`);
      }
    }
  }
}
