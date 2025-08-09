import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue, QueueStatus } from './entities/queue.entity';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class QueuesService {
  constructor(
    @InjectRepository(Queue) private repo: Repository<Queue>,
    private patientsService: PatientsService,
  ) {}

  async create(dto: CreateQueueDto) {
    const patient = await this.patientsService.findOne(dto.patientId);

    // Check if patient is already in queue and waiting/with_doctor
    const existing = await this.repo.findOne({
      where: { patient: { id: patient.id }, status: QueueStatus.WAITING },
    });
    if (existing) throw new BadRequestException('Patient is already in the queue');

    const queueCount = await this.repo.count();
    const queueNumber = `Q${String(queueCount + 1).padStart(3, '0')}`;

    const queue = this.repo.create({
      patient,
      queue_number: queueNumber,
      priority: dto.priority || undefined,
    });
    return this.repo.save(queue);
  }

  findAll(filters?: { status?: QueueStatus; priority?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    return this.repo.find({ where, order: { created_at: 'ASC' } });
  }

  async findOne(id: number) {
    const queue = await this.repo.findOne({ where: { id } });
    if (!queue) throw new NotFoundException('Queue entry not found');
    return queue;
  }

  async update(id: number, dto: UpdateQueueDto) {
    const queue = await this.findOne(id);
    Object.assign(queue, dto);
    return this.repo.save(queue);
  }

  async remove(id: number) {
    const queue = await this.findOne(id);
    return this.repo.remove(queue);
  }

  async removeByPatientId(patientId: number) {
    await this.repo.delete({ patient: { id: patientId } });
  }
}
