import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ROLES } from '../../shared/constants/roles.constant';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn([ROLES.ADMIN, ROLES.STAFF])
  role?: string;
}
