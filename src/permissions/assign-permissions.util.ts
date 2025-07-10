// src/permissions/assign-permissions.util.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { ROLE_PERMISSION_MAP } from './permission-role.map';

@Injectable()
export class PermissionAssigner {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async assignPermissionsToRolesFromConfig() {
    const allPermissions = await this.permissionModel.find({ isDeleted: false });

    for (const [roleName, rules] of Object.entries(ROLE_PERMISSION_MAP)) {
      const role = await this.roleModel.findOne({ name: roleName });
      if (!role) {
        throw new NotFoundException("Không tìm thấy role khi khởi tạo quyền")
        continue;
      }

      const matchedPermissions = allPermissions.filter((perm) => {
        return rules.some((rule) => {
          const matchMethod = !rule.method || rule.method === perm.method;
          const matchApiPath = !rule.apiPath || rule.apiPath === perm.apiPath;
          const matchModule = !rule.module || rule.module === perm.module;
          return matchMethod && matchApiPath && matchModule;
        });
      });

      role.permissions = [...new Set(matchedPermissions.map((p) => p._id as any))];
      await role.save();
      console.log(`✔ Role ${roleName} updated with ${matchedPermissions.length} permissions`);
    }
  }
}
