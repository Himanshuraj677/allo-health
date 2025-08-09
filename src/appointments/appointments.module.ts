import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { PatientsModule } from '../patients/patients.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    PatientsModule,
    DoctorsModule,
    QueuesModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
