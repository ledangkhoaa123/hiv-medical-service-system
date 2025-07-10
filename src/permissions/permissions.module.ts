import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { PermissionScannerService } from './permission-scanner.service';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionAssigner } from './assign-permissions.util';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionScannerService, PermissionAssigner],
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    DiscoveryModule,
  ],
  exports: [PermissionScannerService],
})
export class PermissionsModule {}
