import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ROLES } from '../../shared/constants/roles.constant';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @Column({ type: 'enum', enum: [ROLES.ADMIN, ROLES.STAFF], default: ROLES.STAFF })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
