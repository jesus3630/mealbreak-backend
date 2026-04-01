import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Job } from './job.entity';
import { CompaniesService } from '../companies/companies.service';
import axios from 'axios';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(Job)
    private repo: Repository<Job>,
    private companiesService: CompaniesService,
  ) {}

  async findByCompany(companyId: number) {
    return this.repo.find({ where: { company: { id: companyId } }, order: { createdAt: 'DESC' } });
  }

  // Runs daily at 2am — only refreshes companies that have a careersUrl or website
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async refreshJobCounts() {
    this.logger.log('Starting job count refresh...');
    const { data: companies } = await this.companiesService.findAll({ limit: 9999 });
    let updated = 0;

    for (const company of companies) {
      try {
        const count = await this.fetchJobCount(company.name, company.state);
        if (count !== null) {
          await this.companiesService.updateJobCount(company.id, count);
          updated++;
        }
        // Rate limit: 500ms between requests
        await new Promise(r => setTimeout(r, 500));
      } catch {
        // silently skip
      }
    }
    this.logger.log(`Job count refresh complete. Updated ${updated} companies.`);
  }

  private async fetchJobCount(companyName: string, state?: string): Promise<number | null> {
    try {
      const q = encodeURIComponent(`"${companyName}"`);
      const l = state ? encodeURIComponent(state) : '';
      const url = `https://www.indeed.com/jobs?q=${q}&l=${l}&limit=1`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 8000,
      });

      const html: string = response.data;

      // Try multiple patterns Indeed uses
      const patterns = [
        /(\d[\d,]*)\s+jobs?\s+found/i,
        /"jobCount"\s*:\s*(\d+)/,
        /(\d[\d,]*)\s+results/i,
        /Showing\s+\d+\s+of\s+([\d,]+)/i,
      ];

      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return parseInt(match[1].replace(/,/g, ''), 10);
      }
      return 0;
    } catch {
      return null;
    }
  }

  // Manual trigger for testing
  async triggerRefresh() {
    return this.refreshJobCounts();
  }
}
