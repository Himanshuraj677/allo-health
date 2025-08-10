// src/doctors/doctors.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import dayjs from 'dayjs';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private repo: Repository<Doctor>,
  ) {}

  async create(dto: CreateDoctorDto) {
    this.validateBreaks(dto.work_start_time, dto.work_end_time, dto.breaks || []);

    const doctor = this.repo.create(dto);
    return this.repo.save(doctor);
  }

  async findAll(filters?: { specialization?: string; work_start_time?: string; work_end_time?: string }) {
    const where: any = {};

    if (filters?.specialization) {
      where.specialization = Like(`%${filters.specialization}%`);
    }
    if (filters?.work_start_time) {
      where.work_start_time = filters.work_start_time;
    }
    if (filters?.work_end_time) {
      where.work_end_time = filters.work_end_time;
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

    if (dto.work_start_time || dto.work_end_time || dto.breaks) {
      const workStart = dto.work_start_time || doctor.work_start_time;
      const workEnd = dto.work_end_time || doctor.work_end_time;
      const breaks = dto.breaks || doctor.breaks;
      this.validateBreaks(workStart, workEnd, breaks);
    }

    Object.assign(doctor, dto);
    return this.repo.save(doctor);
  }

  async remove(id: number) {
    const doctor = await this.findOne(id);
    return this.repo.remove(doctor);
  }

  private validateBreaks(workStart: string, workEnd: string, breaks: { start: string; end: string }[]) {
    const startTime = dayjs(`2025-01-01 ${workStart}`);
    const endTime = dayjs(`2025-01-01 ${workEnd}`);

    if (endTime.isBefore(startTime)) {
      throw new BadRequestException('Work end time cannot be before start time');
    }

    for (const br of breaks) {
      const breakStart = dayjs(`2025-01-01 ${br.start}`);
      const breakEnd = dayjs(`2025-01-01 ${br.end}`);

      if (breakEnd.isBefore(breakStart)) {
        throw new BadRequestException('Break end time cannot be before start time');
      }

      if (breakStart.isBefore(startTime) || breakEnd.isAfter(endTime)) {
        throw new BadRequestException('Break time must be within working hours');
      }
    }
  }
}
