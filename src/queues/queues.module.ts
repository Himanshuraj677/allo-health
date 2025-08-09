import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { Queue } from './entities/queue.entity';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), PatientsModule],
  controllers: [QueuesController],
  providers: [QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
