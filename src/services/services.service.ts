import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { pick } from 'lodash';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: SoftDeleteModel<ServiceDocument>,
  ) { }
  async create(createServiceDto: CreateServiceDto, user) {

    const IsExist = await this.serviceModel.findOne({
      name: createServiceDto.name,
    });
    if (IsExist) {
      throw new BadRequestException('Service đã tồn tại');
    }
    const service = await this.serviceModel.create({
      ...createServiceDto
    });
    return {
      createdBy: {
        // _id: user._id,
        // email: user.email,
      },
      createdAt: service.createdAt
    };
  }

  findAll() {
    this.serviceModel.find();
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found service with id=${id}`);
    }
    return this.serviceModel.findOne({ _id: id });
  }

  update(id: string, updateserviceDto: UpdateServiceDto, user: IUser) {
    const fieldsToUpdate = pick(updateserviceDto, [
      'name',
      'description',
      'price',
      'durationMinutes',
      'isActive',
    ]);

    return this.serviceModel.findOneAndUpdate(
      { _id: id },
      {
        ...fieldsToUpdate,
        updatedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
      { new: true }
    );
  }

  async remove(id: string, user: IUser) {
    await this.serviceModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          // _id: user._id,
          // email: user.email,
        },
      },
    );
    return this.serviceModel.softDelete({
      _id: id,
    });
  }
}
