import { IsEnum, IsOptional } from 'class-validator';
import { QueueStatus, QueuePriority } from '../entities/queue.entity';

export class UpdateQueueDto {
  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus;

  @IsOptional()
  @IsEnum(QueuePriority)
  priority?: QueuePriority;
}
