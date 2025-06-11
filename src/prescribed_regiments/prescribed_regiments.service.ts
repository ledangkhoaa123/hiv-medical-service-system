import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePrescribedRegimentDto } from './dto/create-prescribed_regiment.dto';
import { UpdatePrescribedRegimentDto } from './dto/update-prescribed_regiment.dto';
import { PrescribedRegiment } from './schemas/prescribed_regiment.schema';

@Injectable()
export class PrescribedRegimentsService {
  constructor(
    @InjectModel(PrescribedRegiment.name)
    private prescribedRegimentModel: Model<PrescribedRegiment>,
  ) {}

  async create(
    createPrescribedRegimentDto: CreatePrescribedRegimentDto,
  ): Promise<PrescribedRegiment> {
    const createdRegiment = new this.prescribedRegimentModel(
      createPrescribedRegimentDto,
    );
    return createdRegiment.save();
  }
  async findAll(): Promise<PrescribedRegiment[]> {
    return this.prescribedRegimentModel
      .find()
      .populate('treatmentID')
      .populate('baseRegimentID')
      .populate('prescribedBy')
      .exec();
  }
  async findOne(id: string): Promise<PrescribedRegiment> {
    const prescribedRegiment = await this.prescribedRegimentModel
      .findById(id)
      .populate('treatmentID')
      .populate('baseRegimentID')
      .populate('prescribedBy')
      .exec();

    if (!prescribedRegiment) {
      throw new NotFoundException(
        `Prescribed regiment with ID ${id} not found`,
      );
    }
    return prescribedRegiment;
  }
  async update(
    id: string,
    updatePrescribedRegimentDto: UpdatePrescribedRegimentDto,
  ): Promise<PrescribedRegiment> {
    const updatedPrescribedRegiment = await this.prescribedRegimentModel
      .findByIdAndUpdate(id, updatePrescribedRegimentDto, { new: true })
      .exec();

    if (!updatedPrescribedRegiment) {
      throw new NotFoundException(
        `Prescribed regiment with ID ${id} not found`,
      );
    }
    return updatedPrescribedRegiment;
  }
  async delete(id: string): Promise<void> {
    const result = await this.prescribedRegimentModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(
        `Prescribed regiment with ID ${id} not found`,
      );
    }
  }
}
