import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { Permission, PermissionSchema } from 'src/permissions/schemas/permission.schema';

@Module({
  imports:
    [
      MongooseModule.forFeature(
      [
        {name: Role.name, schema: RoleSchema},
        {name: Permission.name, schema: PermissionSchema},

      ])
    ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
