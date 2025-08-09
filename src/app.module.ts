import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { QueuesModule } from './queues/queues.module';
import { AppointmentsModule } from './appointments/appointments.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => getTypeOrmConfig(configService),
    }),
    UsersModule,
    AuthModule,
    DoctorsModule,
    PatientsModule,
    QueuesModule,
    AppointmentsModule,
    ...(process.env.SEED === 'true' ? [SeedModule] : []),
  ],
})
export class AppModule {}
