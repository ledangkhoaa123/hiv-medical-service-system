// src/permissions/permission-scanner.service.ts
import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Injectable()
export class PermissionScannerService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionsService,
  ) {}

  async scanAndCreatePermissions() {
    const controllers = this.discoveryService.getControllers();

    for (const wrapper of controllers) {
      const instance = wrapper.instance;
      if (!instance) continue;

      const controllerPath: string =
        this.reflector.get(PATH_METADATA, instance.constructor) || '';
      const prototype = Object.getPrototypeOf(instance);
      const moduleName =
        instance.constructor.name.replace('Controller', '') || 'Unknown';

      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        const methodRef = prototype[methodName];
        const routePath: string = this.reflector.get(PATH_METADATA, methodRef);
        const requestMethod: RequestMethod = this.reflector.get(
          METHOD_METADATA,
          methodRef,
        );

        if (routePath && requestMethod !== undefined) {
          const fullPath = `/${controllerPath}/${routePath}`.replace(/\/+/g, '/');
          const methodStr = RequestMethod[requestMethod]; // 'GET', 'POST', etc.

          const name = `[${methodStr}] ${fullPath}`;

          await this.permissionService.createIfNotExists({
            name,
            apiPath: fullPath,
            method: methodStr,
            module: moduleName,
          });
        }
      }
    }
  }
}
