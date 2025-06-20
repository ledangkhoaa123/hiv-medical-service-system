import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EducationalDocument,
  EducationalDocumentDocument,
} from './schemas/educational-document.schema';
import { CreateEducationalDocumentDto } from './dto/create-educational-document.dto';
import { UpdateEducationalDocumentDto } from './dto/update-educational-document.dto';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class EducationalDocumentsService {
  constructor(
    @InjectModel(EducationalDocument.name)
    private readonly documentModel: SoftDeleteModel<EducationalDocumentDocument>,
  ) {}

  async create(
    createEducationalDocumentDto: CreateEducationalDocumentDto,
    user: IUser,
  ) {
    const created = new this.documentModel({
      ...createEducationalDocumentDto,
      createdBy: user._id,
    });
    return created.save();
  }

  async findAll() {
    return this.documentModel
      .find()
      .select('-isDeleted -deletedAt')
      .populate({
        path: 'createdBy',
        select: '_id email',
      })
      .exec();
  }

  async findOne(id: string, user: IUser) {
    const doc = await this.documentModel
      .findById(id)
      .select('-isDeleted -deletedAt')
      .populate({
        path: 'createdBy',
        select: '_id email',
      })
      .exec();
    if (!doc) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return doc;
  }

  async update(id: string, dto: UpdateEducationalDocumentDto, user: IUser) {
    const updated = await this.documentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string, user: IUser) {
    const deleted = await this.documentModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return deleted;
  }
}
