import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { comparePassword, hashPassword } from '../shared/utils/password.util';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ROLES } from '../shared/constants/roles.constant';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const hashed = await hashPassword(dto.password);
    return this.usersService.create({ ...dto, password: hashed, role: dto.role || ROLES.STAFF });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await comparePassword(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
      refresh_token: this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET || 'refreshsecret', expiresIn: '7d' }),
    };
  }

  async refresh(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }
}
