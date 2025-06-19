import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { Treatment } from './schemas/treatment.schema';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectModel(Treatment.name) private treatmentModel: Model<Treatment>,
  ) {}

  async create(createTreatmentDto: CreateTreatmentDto, user: IUser) {
    const createdTreatment = new this.treatmentModel(createTreatmentDto);
    return createdTreatment.save();
  }
  async findAll(): Promise<Treatment[]> {
    return this.treatmentModel
      .find()
      .populate('medicalRecordID')
      .populate('doctorID')
      .exec();
  }
  async findOne(id: string, user: IUser) {
    const treatment = await this.treatmentModel
      .findById(id)
      .populate('medicalRecordID')
      .populate('doctorID')
      .exec();

    if (!treatment) {
      throw new NotFoundException(`Treatment with ID ${id} not found`);
    }
    return treatment;
  }
  async update(
    id: string,
    updateTreatmentDto: UpdateTreatmentDto,
    user: IUser,
  ) {
    const updatedTreatment = await this.treatmentModel
      .findByIdAndUpdate(id, updateTreatmentDto, { new: true })
      .exec();

    if (!updatedTreatment) {
      throw new NotFoundException(`Treatment with ID ${id} not found`);
    }
    return updatedTreatment;
  }
  async delete(id: string, user: IUser) {
    const result = await this.treatmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Treatment with ID ${id} not found`);
    }
  }
}
