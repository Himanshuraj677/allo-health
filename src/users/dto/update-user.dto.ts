import { IsOptional, IsString, IsEmail, MinLength, IsIn } from 'class-validator';
import { ROLES } from '../../shared/constants/roles.constant';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsIn([ROLES.ADMIN, ROLES.STAFF])
  role?: string;
}
