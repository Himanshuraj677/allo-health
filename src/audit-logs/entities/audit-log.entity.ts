import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // e.g. 'CREATE_APPOINTMENT', 'UPDATE_DOCTOR'

  @Column()
  module: string; // e.g. 'Appointments', 'Doctors'

  @Column({ nullable: true })
  userId: number; // who performed the action

  @Column({ type: 'json', nullable: true })
  details: any; // extra info about the action

  @CreateDateColumn()
  created_at: Date;
}
