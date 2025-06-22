import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateArvRegimentDto } from './dto/create-arv_regiment.dto';
import { UpdateArvRegimentDto } from './dto/update-arv_regiment.dto';
import {
  ArvRegiment,
  ArvRegimentDocument,
} from './schemas/arv_regiment.schema';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ArvDrugsService } from 'src/arv_drugs/arv_drugs.service';

@Injectable()
export class ArvRegimentsService {
  constructor(
    @InjectModel(ArvRegiment.name)
    private arvRegimentModel: SoftDeleteModel<ArvRegimentDocument>,

    private arvDrugsService: ArvDrugsService,
  ) {}

  async create(createArvRegimentDto: CreateArvRegimentDto, user: IUser) {
    const existing = await this.arvRegimentModel.findOne({
      name: createArvRegimentDto.name,
    });

    if (existing) {
      throw new ConflictException(
        `${createArvRegimentDto.name} đã tồn tại trong hệ thống`,
      );
    }
    for (const drug of createArvRegimentDto.drugs) {
  const drugExists = await this.arvDrugsService.findOne(drug.drugId.toString());
  if (!drugExists) {
    throw new BadRequestException(`Thuốc với id ${drug.drugId} không tồn tại`);
  }
}
    const regiment = await this.arvRegimentModel.create({
      ...createArvRegimentDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: regiment._id,
      createAt: regiment.createdAt,
    };
  }

  async findAll() {
    return await this.arvRegimentModel.find().populate({
      path: 'drugs.drugId',
      select: { genericName: 1, manufacturer: 1 },
    });
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Không tìm thấy ARV Regiment với ID ${id}`);
    }
    return await this.arvRegimentModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updateArvRegimentDto: UpdateArvRegimentDto,
    user: IUser,
  ) {
    if (!(await this.findOne(id))) {
      throw new NotFoundException(`Không tìm thấy ARV Regiment với ID ${id}`);
    }
   if (updateArvRegimentDto.name) {
      const conflict = await this.arvRegimentModel.findOne({
        name: updateArvRegimentDto.name,
        _id: { $ne: id },
      });
      if (conflict) {
        throw new ConflictException(
          `${updateArvRegimentDto.name} đã tồn tại`,
        );
      }
    }
    return await this.arvRegimentModel.updateOne(
      { _id: id },
      { ...updateArvRegimentDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
       },
    );
  }

  async remove(id: string, user: IUser) {
     if (!(await this.findOne(id))) {
       throw new BadRequestException(`Không tìm thấy ARV Regiment với id=${id}`);
     }
     await this.arvRegimentModel.updateOne(
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
     return this.arvRegimentModel.softDelete({
       _id: id,
     });
   }
}