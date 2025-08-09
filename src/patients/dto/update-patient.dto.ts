import { IsString, IsOptional, IsDateString, Length } from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 15)
  phone?: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsString()
  gender?: string;
}
