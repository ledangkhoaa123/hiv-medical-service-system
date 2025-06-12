import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: SoftDeleteModel<ServiceDocument>,
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
    const service = await this.serviceModel.findOne({ _id: id });
    if (!service) {
      throw new BadRequestException(`Không tìm thấy dịch vụ với id=${id}`);
    }
    return service;
  }

  async update(id: string, updateserviceDto: UpdateServiceDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Sai định dạng id`);
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
    try {
      const updated = await this.serviceModel.findOneAndUpdate(
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
      if (!updated) {
        throw new BadRequestException(`Không tìm thấy dịch vụ với id=${id}`);
      }
      return updated;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Tên dịch vụ đã tồn tại');
      }
      throw error;
    }
  }
  async remove(id: string, user: IUser) {
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
