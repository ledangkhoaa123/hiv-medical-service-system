import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateArvDrugDto } from './dto/create-arv_drug.dto';
import { UpdateArvDrugDto } from './dto/update-arv_drug.dto';
import { ArvDrug } from './schemas/arv_drug.schema';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class ArvDrugsService {
  constructor(
    @InjectModel(ArvDrug.name) private arvDrugModel: Model<ArvDrug>,
  ) {}

  async create(createArvDrugDto: CreateArvDrugDto, user: IUser) {
    const existing = await this.arvDrugModel.findOne({
      drug_code: createArvDrugDto.drug_code,
    });

    if (existing) {
      throw new ConflictException(
        `Drug with code ${createArvDrugDto.drug_code} already exists`,
      );
    }

    const createdDrug = new this.arvDrugModel(createArvDrugDto);
    return createdDrug.save();
  }

  async findAll() {
    return this.arvDrugModel.find().exec();
  }

  async findOne(id: string, user: IUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    const drug = await this.arvDrugModel.findById(id).exec();
    if (!drug) {
      throw new NotFoundException(`ARV Drug with ID ${id} not found`);
    }
    return drug;
  }

  async update(id: string, updateArvDrugDto: UpdateArvDrugDto, user: IUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }

    if (updateArvDrugDto.drug_code) {
      const conflict = await this.arvDrugModel.findOne({
        drug_code: updateArvDrugDto.drug_code,
        _id: { $ne: id },
      });
      if (conflict) {
        throw new ConflictException(
          `Another drug with code ${updateArvDrugDto.drug_code} already exists`,
        );
      }
    }

    const updatedDrug = await this.arvDrugModel
      .findByIdAndUpdate(id, updateArvDrugDto, { new: true })
      .exec();
    if (!updatedDrug) {
      throw new NotFoundException(`ARV Drug with ID ${id} not found`);
    }
    return updatedDrug;
  }

  async delete(id: string, user: IUser) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    const result = await this.arvDrugModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`ARV Drug with ID ${id} not found`);
    }
  }
}
