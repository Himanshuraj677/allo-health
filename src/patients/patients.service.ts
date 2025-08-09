import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(@InjectRepository(Patient) private repo: Repository<Patient>) {}

  create(dto: CreatePatientDto) {
    const patient = this.repo.create(dto);
    return this.repo.save(patient);
  }

  findAll(search?: { name?: string; phone?: string }) {
    const where: any = {};
    if (search?.name) {
      where.name = ILike(`%${search.name}%`);
    }
    if (search?.phone) {
      where.phone = ILike(`%${search.phone}%`);
    }
    return this.repo.find({ where });
  }

  async findOne(id: number) {
    const patient = await this.repo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async update(id: number, dto: UpdatePatientDto) {
    const patient = await this.findOne(id);
    Object.assign(patient, dto);
    return this.repo.save(patient);
  }

  async remove(id: number) {
    const patient = await this.findOne(id);
    return this.repo.remove(patient);
  }
}
