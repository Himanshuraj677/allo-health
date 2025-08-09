import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsString()
  specialization: string;

  @IsString()
  gender: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsArray()
  availability?: string[];
}
