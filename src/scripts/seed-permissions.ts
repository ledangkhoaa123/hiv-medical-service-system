import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PermissionAssigner } from 'src/permissions/assign-permissions.util';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const assigner = app.get(PermissionAssigner); // <-- phải được provide từ AppModule context
  await assigner.assignPermissionsToRolesFromConfig();
  await app.close();
}

seed();
