import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private repo: Repository<Alert>,
  ) {}

  async create(userId: number, dto: Partial<Alert>) {
    const alert = this.repo.create({ ...dto, user: { id: userId } as any });
    return this.repo.save(alert);
  }

  async findByUser(userId: number) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  async delete(id: number, userId: number) {
    await this.repo.delete({ id, user: { id: userId } });
  }
}
