import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';


@Injectable()
export class DoctorsService {
  constructor(@InjectRepository(Doctor) private repo: Repository<Doctor>) {}

  create(dto: CreateDoctorDto) {
    const doctor = this.repo.create(dto);
    return this.repo.save(doctor);
  }

  findAll(search?: { specialization?: string; location?: string }) {
    const where: any = {};
    if (search?.specialization) {
      where.specialization = ILike(`%${search.specialization}%`);
    }
    if (search?.location) {
      where.location = ILike(`%${search.location}%`);
    }
    return this.repo.find({ where });
  }

  async findOne(id: number) {
    const doctor = await this.repo.findOne({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto) {
    const doctor = await this.findOne(id);
    Object.assign(doctor, dto);
    return this.repo.save(doctor);
  }

  async remove(id: number) {
    const doctor = await this.findOne(id);
    return this.repo.remove(doctor);
  }
}
