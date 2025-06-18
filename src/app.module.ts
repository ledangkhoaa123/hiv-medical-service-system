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
import { ArvDrug } from './arv_drugs/schemas/arv_drug.schema';
import { ArvDrugsModule } from './arv_drugs/arv_drugs.module';
import { ArvRegimentsModule } from './arv_regiments/arv_regiments.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { PrescribedRegimentsModule } from './prescribed_regiments/prescribed_regiments.module';
import { TestResultsModule } from './test-results/test-results.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { Service } from './services/schemas/service.schema';
import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { DoctorSlotsModule } from './doctor_slots/doctor_slots.module';
import { Payment } from './payments/schemas/payment.schema';
import { PaymentsModule } from './payments/payments.module';
import { DoctorSchedulesModule } from './doctor_schedules/doctor_schedules.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    AppointmentsModule,
    AnonymousAppointmentsModule,
    DoctorSlotsModule,
    PaymentsModule,
    ServicesModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    PatientsModule,
    DoctorsModule,
    ArvDrugsModule,
    ArvRegimentsModule,
    MedicalRecordsModule,
    PrescribedRegimentsModule,
    TestResultsModule,
    TreatmentsModule,
    DoctorSchedulesModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
