import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../shared/utils/password.util';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(createDto: CreateUserDto) {
    const hashed = await hashPassword(createDto.password);
    const user = this.repo.create({ ...createDto, password: hashed });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    if (dto.password) {
      dto.password = await hashPassword(dto.password);
    }
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.repo.remove(user);
  }
}
