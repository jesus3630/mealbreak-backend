import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
export declare class CompaniesService implements OnApplicationBootstrap {
    private repo;
    constructor(repo: Repository<Company>);
    onApplicationBootstrap(): Promise<void>;
    private seedFromStaticFiles;
    findAll(filters: {
        state?: string;
        zip?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: Company[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: number): Promise<Company | null>;
    updateCareersUrl(id: number, careersUrl: string): Promise<Company | null>;
    updateJobCount(id: number, jobCount: number): Promise<void>;
    getStates(): Promise<any[]>;
}
