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
<<<<<<< HEAD
<<<<<<< HEAD
import { ArvRegiment } from './schemas/arv_regiment.schema';
import { IUser } from 'src/users/user.interface';
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
import {
  ArvRegiment,
  ArvRegimentDocument,
} from './schemas/arv_regiment.schema';
import { IUser } from 'src/users/user.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ArvDrugsService } from 'src/arv_drugs/arv_drugs.service';
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf

@Injectable()
export class ArvRegimentsService {
  constructor(
<<<<<<< HEAD
<<<<<<< HEAD
    @InjectModel(ArvRegiment.name) private arvRegimentModel: Model<ArvRegiment>,
  ) {}

  async create(createArvRegimentDto: CreateArvRegimentDto, user: IUser) {
    const createdRegiment = new this.arvRegimentModel(createArvRegimentDto);
    return createdRegiment.save();
  }

  async findAll() {
    return this.arvRegimentModel.find().exec();
  }
  async findOne(id: string, user: IUser) {
    const regiment = await this.arvRegimentModel.findById(id).exec();
    if (!regiment) {
      throw new NotFoundException(`ARV Regiment with ID ${id} not found`);
=======
    @InjectModel(ArvRegiment.name)
    private arvRegimentModel: SoftDeleteModel<ArvRegimentDocument>,

    private arvDrugsService: ArvDrugsService,
  ) {}

=======
    @InjectModel(ArvRegiment.name)
    private arvRegimentModel: SoftDeleteModel<ArvRegimentDocument>,

    private arvDrugsService: ArvDrugsService,
  ) {}

>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async create(createArvRegimentDto: CreateArvRegimentDto, user: IUser) {
    const existing = await this.arvRegimentModel.findOne({
      name: createArvRegimentDto.name,
    });

    if (existing) {
      throw new ConflictException(
        `${createArvRegimentDto.name} đã tồn tại trong hệ thống`,
      );
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
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

<<<<<<< HEAD
<<<<<<< HEAD
  async update(
    id: string,
    updateArvRegimentDto: UpdateArvRegimentDto,
    user: IUser,
  ) {
    const updatedRegiment = await this.arvRegimentModel
      .findByIdAndUpdate(id, updateArvRegimentDto, { new: true })
      .exec();
    if (!updatedRegiment) {
      throw new NotFoundException(`ARV Regiment with ID ${id} not found`);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async findAll() {
    return await this.arvRegimentModel.find().populate({
      path: 'drugs.drugId',
      select: { genericName: 1, manufacturer: 1 },
    });
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Không tìm thấy ARV Regiment với ID ${id}`);
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
    }
    return await this.arvRegimentModel.findOne({ _id: id });
  }

<<<<<<< HEAD
<<<<<<< HEAD
  async delete(id: string, user: IUser) {
    const result = await this.arvRegimentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`ARV Regiment with ID ${id} not found`);
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
  async update(
    id: string,
    updateArvRegimentDto: UpdateArvRegimentDto,
    user: IUser,
  ) {
    if (!(await this.findOne(id))) {
      throw new NotFoundException(`Không tìm thấy ARV Regiment với ID ${id}`);
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf

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
<<<<<<< HEAD
>>>>>>> 88fa26ca5f1230add3c7fc7008f6fc67b2f70598
=======
>>>>>>> 09a0db82c012a1a6ae1c4fbd1123026f7ded2faf
}
