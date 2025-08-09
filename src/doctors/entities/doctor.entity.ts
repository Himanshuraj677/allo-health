// src/doctors/entities/doctor.entity.ts
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  specialization: string;

  @Column({ type: 'time', default: '09:00' })
  work_start_time: string;

  @Column({ type: 'time', default: '17:00' })
  work_end_time: string;

  @Column({ type: 'int', default: 30 }) // in minutes
  slot_duration: number;

  @Column({ type: 'json', nullable: true })
  breaks: { start: string; end: string }[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
