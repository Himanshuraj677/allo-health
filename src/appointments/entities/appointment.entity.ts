import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

export enum AppointmentStatus {
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { eager: true, onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => Doctor, { eager: true, onDelete: 'CASCADE' })
  doctor: Doctor;

  @Column({ type: 'date' })
  appointment_date: string;

  @Column({ type: 'time' })
  appointment_time: string;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.BOOKED })
  status: AppointmentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
