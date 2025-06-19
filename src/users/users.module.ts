import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports:
  [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Role.name, schema: RoleSchema}
    ]),
    PatientsModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
