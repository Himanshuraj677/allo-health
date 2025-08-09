import { IsInt, IsEnum, IsOptional } from 'class-validator';
import { QueuePriority } from '../entities/queue.entity';

export class CreateQueueDto {
  @IsInt()
  patientId: number;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;
}
