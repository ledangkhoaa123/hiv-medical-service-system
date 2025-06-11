import { PermissionsModule } from './permissions/permissions.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesModule } from './roles/roles.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AnonymousAppointmentsModule } from './anonymous-appointments/anonymous-appointments.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    UsersModule, AuthModule, RolesModule, PermissionsModule, PatientsModule, DoctorsModule, AnonymousAppointmentsModule],
  controllers: [AppController],
  providers: [AppService, 
    {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  ],
})
export class AppModule {}
