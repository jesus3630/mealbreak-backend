import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { CompaniesService } from '../companies/companies.service';
export declare class JobsService {
    private repo;
    private companiesService;
    private readonly logger;
    constructor(repo: Repository<Job>, companiesService: CompaniesService);
    findByCompany(companyId: number): Promise<Job[]>;
    refreshJobCounts(): Promise<void>;
    private fetchJobCount;
    triggerRefresh(): Promise<void>;
}
