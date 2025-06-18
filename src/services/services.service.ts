import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import { MedicalRecordsService } from 'src/medical-records/medical-records.service';
import { TreatmentsService } from 'src/treatments/treatments.service';
import { ServiceName } from 'src/enums/all_enums';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: SoftDeleteModel<ServiceDocument>,
    private readonly medicalService: MedicalRecordsService,
    private readonly treatmentSercice: TreatmentsService
  ) { }
  async create(createServiceDto: CreateServiceDto, user: IUser) {
    try {
      const IsExist = await this.serviceModel.findOne({ name: createServiceDto.name });
      if (IsExist) {
        throw new BadRequestException('Tên dịch vụ đã tồn tại');
      }
      const service = await this.serviceModel.create({
        ...createServiceDto,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
      return service;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Tên dịch vụ đã tồn tại');
      }
      throw error;
    }
  }

  findAll() {
    return this.serviceModel.find();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Sai định dạng id`);
    }
    return await this.serviceModel.findOne({ _id: id });
  }



  // async validateServiceSelection(patientId: string, selectedService: ServiceName) {
  //   const medicalRecord = await this.medicalService.findOne(
  //     patientId);

  //   if (!medicalRecord) {
  //     if (selectedService !== ServiceName.BASIC_CHECKUP) {
  //       throw new BadRequestException(
  //         'Bạn chưa có hồ sơ bệnh án. Vui lòng chọn khám tổng quát trước.',
  //       );
  //     }
  //   } else {
  //     if (selectedService === ServiceName.BASIC_CHECKUP) {
  //       throw new BadRequestException(
  //         'Bạn đã có hồ sơ bệnh án. Không cần khám tổng quát nữa.',
  //       );
  //     }

  //     // Kiểm tra xem có từng điều trị HIV chưa
  //     const hasHIVTreatment = await this.treatmentSercice.findOne(
  //       medicalRecord._id.toString()
  //     );
  //     if (selectedService === ServiceName.FOLLOW_UP) {
  //       if (!hasHIVTreatment) {
  //         throw new BadRequestException(
  //           'Bạn cần  điều trị HIV trước khi chọn tái khám.',
  //         );
  //       }else {
  //         if(hasHIVTreatment &&
  //           hasHIVTreatment.followUpDate &&
  //           moment().isBefore(moment(hasHIVTreatment.followUpDate)))
  //       }

  //     }
  //       .sort({ treatmentDate: -1 }); // lấy điều trị gần nhất

  //     if (selectedService === ServiceName.HIV_TREATMENT) {
  //       if (hasHIVTreatment) {
  //         if (
  //           latestHIVTreatment &&
  //           latestHIVTreatment.followUpDate &&
  //           moment().isBefore(moment(latestHIVTreatment.followUpDate))
  //         ) {
  //           throw new BadRequestException(
  //             'Bạn đang trong thời gian theo dõi. Vui lòng đặt lịch tái khám.',
  //           );
  //         }

  //         // Nếu đã điều trị và hết thời gian theo dõi → có thể cho điều trị lại (nếu cần), hoặc ngăn lại
  //         throw new BadRequestException(
  //           'Bạn đã đăng ký điều trị HIV. Vui lòng đặt lịch tái khám nếu cần.',
  //         );
  //       }
  //     }
    

  async update(id: string, updateserviceDto: UpdateServiceDto, user: IUser) {
        if (!(await this.findOne(id))) {
          throw new BadRequestException(`Không tìm thấy dịch vụ với id=${id}`);
        }

        if (updateserviceDto.name) {
          const existed = await this.serviceModel.findOne({
            name: updateserviceDto.name,
            _id: { $ne: id }
          });
          if (existed) {
            throw new BadRequestException('Tên dịch vụ đã tồn tại');
          }
        }
        return await this.serviceModel.updateOne(
          { _id: id },
          {
            ...updateserviceDto,
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
          { new: true }
        );
      }
  
  async remove(id: string, user: IUser) {
        if (!(await this.findOne(id))) {
          throw new BadRequestException(`Không tìm thấy dịch vụ với id=${id}`);
        }
        await this.serviceModel.updateOne(
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
        return this.serviceModel.softDelete({
          _id: id,
        });
      }
    }
