/* eslint-disable prefer-const */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
//import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method, module, name } = createPermissionDto;
    const IsExist = await this.permissionModel.findOne({
      $and: [{ apiPath: apiPath }, { method: method }],
    });
    if (IsExist) {
      throw new BadRequestException('Quyền hạn đã tồn tại');
    }
    const createdBy = {
      _id: user._id,
      email: user.email,
    };
    const permission = await this.permissionModel.create({
      apiPath,
      method,
      module,
      name,
      createdBy: createdBy,
    });
    return {
      _id: permission._id,
      createdAt: permission.createdAt,
    };
  }
  findAll() {
    return this.permissionModel.find();
  }
  // async findAll(currentPage: number, limit: number, qs: string) {
  //   const { filter, sort, population } = aqp(qs);
  //   delete filter.current;
  //   delete filter.pageSize;

  //   let offset = (+currentPage - 1) * (+limit);
  //   let defaultLimit = +limit ? +limit : 10;

  //   const totalItems = (await this.permissionModel.find(filter)).length;
  //   const totalPages = Math.ceil(totalItems / defaultLimit);

  //   const result = await this.permissionModel.find(filter)
  //     .skip(offset)
  //     .limit(defaultLimit)
  //     .sort(sort as any)
  //     .populate(population)
  //     .exec();

  //     return {
  //       meta: {
  //         current: currentPage, //trang hiện tại
  //         pageSize: limit, //số lượng bản ghi muốn lấy
  //         pages: totalPages,  //tổng số trang với điều kiện query
  //         total: totalItems // tổng số phần tử (số bản ghi)
  //       },
  //       result //kết quả query
  //     }

  // }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Không tìm thấy permission, kiểm tra lại ID');
    }
    return this.permissionModel.findOne({ _id: id });
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'Không tìm thấy permission, kiểm tra lại ID',
      );
    }
    const IsExist = await this.permissionModel.findOne({
      $and: [
        { apiPath: updatePermissionDto.apiPath },
        { method: updatePermissionDto.method },
      ],
    });
    if (IsExist) {
      throw new BadRequestException('Quyền hạn đã tồn tại');
    }
    return await this.permissionModel.updateOne(
      { _id: id },
      {
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        ...updatePermissionDto,
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'Không tìm thấy permission, kiểm tra lại ID',
      );
    }
    await this.permissionModel.updateOne(
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
    return this.permissionModel.softDelete({
      _id: id,
    });
  }
}
