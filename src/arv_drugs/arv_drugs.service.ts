import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateArvDrugDto } from './dto/create-arv_drug.dto';
import { UpdateArvDrugDto } from './dto/update-arv_drug.dto';
import { ArvDrug, ArvDrugDocument } from './schemas/arv_drug.schema';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class ArvDrugsService {
  constructor(
    @InjectModel(ArvDrug.name) private arvDrugModel: SoftDeleteModel<ArvDrugDocument>,
  ) {}

  async create(createArvDrugDto: CreateArvDrugDto, user: IUser) {
    const existing = await this.arvDrugModel.findOne({
      genericName: createArvDrugDto.genericName,
    });

    if (existing) {
      throw new ConflictException(
        `${createArvDrugDto.genericName} đã tồn tại trong hệ thống`,
      );
    }

    const drug = await this.arvDrugModel.create({
      ...createArvDrugDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: drug._id,
      createAt: drug.createdAt,
    };
  }

  async findAll() {
    return await this.arvDrugModel.find();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Không tìm thấy ARV Drug với ID ${id}`);
    }
    return await this.arvDrugModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updateArvDrugDto: UpdateArvDrugDto,
    user: IUser,
  ) {
    if (!(await this.findOne(id))) {
      throw new NotFoundException(`Không tìm thấy ARV Drug với ID ${id}`);
    }

    if (updateArvDrugDto.genericName) {
      const conflict = await this.arvDrugModel.findOne({
        genericName: updateArvDrugDto.genericName,
        _id: { $ne: id },
      });
      if (conflict) {
        throw new ConflictException(
          `${updateArvDrugDto.genericName} đã tồn tại`,
        );
      }
    }

    return await this.arvDrugModel.updateOne(
      { _id: id },
      { ...updateArvDrugDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
       },
    );
  }

  async remove(id: string, user: IUser) {
     if (!(await this.findOne(id))) {
       throw new BadRequestException(`Không tìm thấy ARV Drug với id=${id}`);
     }
     await this.arvDrugModel.updateOne(
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
     return this.arvDrugModel.softDelete({
       _id: id,
     });
   }
}