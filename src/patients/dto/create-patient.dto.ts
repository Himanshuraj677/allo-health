import { IsString, IsOptional, IsDateString, Length } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsString()
  @Length(10, 15)
  phone: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsString()
  gender: string;
}
