import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  appointment_date?: string;

  @IsOptional()
  @IsString()
  appointment_time?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
