import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArvRegimentDto } from './dto/create-arv_regiment.dto';
import { UpdateArvRegimentDto } from './dto/update-arv_regiment.dto';
import { ArvRegiment } from './schemas/arv_regiment.schema';

@Injectable()
export class ArvRegimentsService {
  constructor(@InjectModel(ArvRegiment.name) private arvRegimentModel: Model<ArvRegiment>) {}

  async create(createArvRegimentDto: CreateArvRegimentDto): Promise<ArvRegiment> {
    const createdRegiment = new this.arvRegimentModel(createArvRegimentDto);
    return createdRegiment.save();
  }

  async findAll(): Promise<ArvRegiment[]> {
    return this.arvRegimentModel.find().exec();
  }
  async findOne(id: string): Promise<ArvRegiment> {
    const regiment = await this.arvRegimentModel.findById(id).exec();
    if (!regiment) {
      throw new NotFoundException(`ARV Regiment with ID ${id} not found`);
    }
    return regiment;
  }

  async update(id: string, updateArvRegimentDto: UpdateArvRegimentDto): Promise<ArvRegiment> {
    const updatedRegiment = await this.arvRegimentModel
      .findByIdAndUpdate(id, updateArvRegimentDto, { new: true })
      .exec();
    if (!updatedRegiment) {
      throw new NotFoundException(`ARV Regiment with ID ${id} not found`);
    }
    return updatedRegiment;
  }

  async delete(id: string): Promise<void> {
    const result = await this.arvRegimentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`ARV Regiment with ID ${id} not found`);
    }
  }
}