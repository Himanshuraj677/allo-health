import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  patientId: number;

  @IsInt()
  doctorId: number;

  @IsDateString()
  appointment_date: string;

  @IsString()
  appointment_time: string;
}
