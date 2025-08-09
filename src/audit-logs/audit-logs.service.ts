import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog) private repo: Repository<AuditLog>,
  ) {}

  async logAction(action: string, module: string, userId?: number, details?: any) {
    const log = this.repo.create({
      action,
      module,
      userId,
      details,
    });
    return this.repo.save(log);
  }

  findAll() {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }
}
