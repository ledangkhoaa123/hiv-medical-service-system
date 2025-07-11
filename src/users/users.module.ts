import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';
import { PatientsModule } from 'src/patients/patients.module';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema }
    ]),
    PatientsModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'), // hoặc JWT_SECRET
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }