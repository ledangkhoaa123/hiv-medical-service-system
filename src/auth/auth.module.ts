import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { RolesModule } from 'src/roles/roles.module';
import { MailModule } from 'src/mail/mail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema'; 
import { UserSchema } from 'src/users/schemas/user.schema';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy,],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    UsersModule,
    RolesModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: "1d",
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService]
})
export class AuthModule { }
