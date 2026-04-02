import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Company } from './company.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CompaniesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedFromStaticFiles();
  }

  private async seedFromStaticFiles() {
    try {
      const dataPath = path.join(__dirname, '../../../companies_data.js');
      const websitesPath = path.join(__dirname, '../../../company_websites.js');

      console.log(`Seed: looking for data at ${dataPath}`);
      if (!fs.existsSync(dataPath)) {
        console.error(`Seed: file not found at ${dataPath}`);
        return;
      }

      let dataContent = fs.readFileSync(dataPath, 'utf8');
      let websitesContent = fs.existsSync(websitesPath)
        ? fs.readFileSync(websitesPath, 'utf8')
        : 'const COMPANY_WEBSITES = {};';

      // Evaluate JS files to extract data
      const dataFn = new Function(dataContent + '; return COMPANIES;');
      const websitesFn = new Function(websitesContent + '; return COMPANY_WEBSITES;');

      const companies: any[] = dataFn();
      const websites: Record<string, string> = websitesFn();

      const guardCompanies = companies.filter(c =>
        c.type && c.type.split(',').map((t: string) => t.trim()).includes('GUARD'),
      );

      const batch = guardCompanies.map(c => ({
        name: c.name as string,
        city: c.city || undefined,
        state: c.state || undefined,
        zip: c.zip || undefined,
        phone: c.phone || undefined,
        type: c.type || undefined,
        employees: c.employees || undefined,
        license: c.license || undefined,
        expires: c.expires || undefined,
        website: websites[c.name] || undefined,
        careersUrl: undefined,
        jobCount: 0,
      }));

      // Use upsert to handle duplicate names gracefully
      await this.repo
        .createQueryBuilder()
        .insert()
        .into(Company)
        .values(batch)
        .orIgnore()
        .execute();
      console.log(`Seeded ${batch.length} companies into database.`);
    } catch (err) {
      console.error('Seed error:', err.message, err.stack);
    }
  }

  async findAll(filters: { state?: string; zip?: string; search?: string; page?: number; limit?: number }) {
    const { state, zip, search, page = 1, limit = 24 } = filters;
    const qb = this.repo.createQueryBuilder('c');

    if (state) qb.andWhere('c.state = :state', { state });
    if (zip) qb.andWhere('c.zip LIKE :zip', { zip: `${zip}%` });
    if (search) qb.andWhere('c.name ILIKE :search', { search: `%${search}%` });

    qb.orderBy('c.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['jobs'] });
  }

  async updateCareersUrl(id: number, careersUrl: string) {
    await this.repo.update(id, { careersUrl });
    return this.repo.findOne({ where: { id } });
  }

  async updateJobCount(id: number, jobCount: number) {
    await this.repo.update(id, { jobCount, jobCountUpdatedAt: new Date() });
  }

  async getStates() {
    const rows = await this.repo
      .createQueryBuilder('c')
      .select('DISTINCT c.state', 'state')
      .where('c.state IS NOT NULL')
      .orderBy('c.state', 'ASC')
      .getRawMany();
    return rows.map(r => r.state);
  }
}
