import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { JwtStrategy } from './passport/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy,],
  imports: [
    UsersModule,
    RolesModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: "1h",
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService]
})
export class AuthModule {}
