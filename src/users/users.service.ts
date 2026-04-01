import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(email: string, password: string, name?: string): Promise<User> {
    const existing = await this.repo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hashed, name });
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async saveCompany(userId: number, companyId: number): Promise<number[]> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const saved = user.savedCompanies || [];
    if (!saved.includes(companyId)) {
      user.savedCompanies = [...saved, companyId];
      await this.repo.save(user);
    }
    return user.savedCompanies;
  }

  async unsaveCompany(userId: number, companyId: number): Promise<number[]> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.savedCompanies = (user.savedCompanies || []).filter(id => id !== companyId);
    await this.repo.save(user);
    return user.savedCompanies;
  }

  async saveSearch(userId: number, search: string): Promise<string[]> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const saved = user.savedSearches || [];
    if (!saved.includes(search)) {
      user.savedSearches = [...saved, search];
      await this.repo.save(user);
    }
    return user.savedSearches;
  }
}
