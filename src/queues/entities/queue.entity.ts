import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

export enum QueueStatus {
  WAITING = 'waiting',
  WITH_DOCTOR = 'with_doctor',
  COMPLETED = 'completed',
}

export enum QueuePriority {
  NORMAL = 'normal',
  URGENT = 'urgent',
}

@Entity('queues')
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { eager: true, onDelete: 'CASCADE' })
  patient: Patient;

  @Column({ length: 50 })
  queue_number: string;

  @Column({ type: 'enum', enum: QueueStatus, default: QueueStatus.WAITING })
  status: QueueStatus;

  @Column({ type: 'enum', enum: QueuePriority, default: QueuePriority.NORMAL })
  priority: QueuePriority;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
