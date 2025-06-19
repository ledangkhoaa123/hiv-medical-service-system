import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacilityInfoDto } from './dto/create-facility-infos.dto';
import { UpdateFacilityInfoDto } from './dto/update-facility-infos.dto';
import {
  FacilityInfo,
  FacilityInfoDocument,
} from './schemas/facility-infos.schema';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class FacilityInfosService {
  constructor(
    @InjectModel(FacilityInfo.name)
    private facilityModel: SoftDeleteModel<FacilityInfoDocument>,
  ) {}

  create(createFacilityInfoDto: CreateFacilityInfoDto, user: IUser) {
    const created = new this.facilityModel(createFacilityInfoDto, user);
    return created.save();
  }

  findAll() {
    return this.facilityModel.find().exec();
  }

  async findOne(id: string, user: IUser) {
    const result = await this.facilityModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException('Facility Info not found');
    }
    return result;
  }

  async update(
    id: string,
    updateFacilityInfoDto: UpdateFacilityInfoDto,
    user: IUser,
  ) {
    const result = await this.facilityModel.findByIdAndUpdate(
      id,
      updateFacilityInfoDto,
      {
        new: true,
      },
    );
    if (!result) {
      throw new NotFoundException('Facility Info not found');
    }
    return result;
  }

  async delete(id: string, user: IUser) {
    const result = await this.facilityModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Facility Info not found');
    return result;
  }
}
