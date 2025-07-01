import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import { log } from 'console';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema';
import { RoleName } from 'src/enums/all_enums';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
    private configService: ConfigService,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const IsExist = await this.roleModel.findOne({
      name: createRoleDto.name.toUpperCase(),
    });
    if (IsExist) {
      throw new BadRequestException('Tên Role đã tồn tại');
    }
    const invalidPermissions = await this.permissionModel.findOne({_id: {$in: createRoleDto.permissions}, isDeleted: true});
    if (invalidPermissions) {
      throw new BadRequestException("Permission không khả dụng");
    }
    const createdBy = {
      _id: user._id,
      email: user.email,
    };
    const role = await this.roleModel.create({
      ...createRoleDto,
      createdBy: createdBy,
    });
    return {
      _id: role._id,
      createdAt: role.createdAt,
    };
  }
  findAll() {
    return this.roleModel.find().populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
  }
  // async findAll(currentPage: number, limit: number, qs: string) {
  //   const { filter, sort, population } = aqp(qs);
  //   delete filter.current;
  //   delete filter.pageSize;

  //   let offset = (+currentPage - 1) * +limit;
  //   let defaultLimit = +limit ? +limit : 10;

  //   const totalItems = (await this.roleModel.find(filter)).length;
  //   const totalPages = Math.ceil(totalItems / defaultLimit);

  //   const result = await this.roleModel
  //     .find(filter)
  //     .skip(offset)
  //     .limit(defaultLimit)
  //     .sort(sort as any)
  //     .populate(population)
  //     .exec();

  //   return {
  //     meta: {
  //       current: currentPage, //trang hiện tại
  //       pageSize: limit, //số lượng bản ghi muốn lấy
  //       pages: totalPages, //tổng số trang với điều kiện query
  //       total: totalItems, // tổng số phần tử (số bản ghi)
  //     },
  //     result, //kết quả query
  //   };
  // }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Không tìm thấy role, kiểm tra lại ID');
    }
    const role = await this.roleModel.findOne({ _id: id, isDeleted: false}).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
    if (!role) {
      throw new BadRequestException('Role không khả dụng');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Không tìm thấy Role, kiểm tra lại ID');
    }
    // const IsExist = await this.roleModel.findOne({
    //   name: updateRoleDto.name,
    // });
    // if (IsExist) {
    //   throw new BadRequestException('Tên Role đã tồn tại');
    // }
    return await this.roleModel.updateOne(
      { _id: id },
      {
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
        ...updateRoleDto,
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Không tìm thấy Role, kiểm tra lại ID');
    }
    const foundRole = await this.roleModel.findById(id);
    //Tam thoi HARDCODE
     if (foundRole.name === "ADMIN_ROLE") {
       throw new BadRequestException(`Không thể xóa role ADMIN`);
     }
    await this.roleModel.updateOne(
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
    return this.roleModel.softDelete({
      _id: id,
    });
  }
  findByRoleName = async(name : RoleName) => {
    return await this.roleModel.findOne({name: name});
  }
}
