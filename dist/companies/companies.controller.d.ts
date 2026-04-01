import { CompaniesService } from './companies.service';
export declare class CompaniesController {
    private readonly service;
    constructor(service: CompaniesService);
    findAll(state?: string, zip?: string, search?: string, page?: string, limit?: string): Promise<{
        data: import("./company.entity").Company[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getStates(): Promise<any[]>;
    findOne(id: string): Promise<import("./company.entity").Company | null>;
    updateCareersUrl(id: string, careersUrl: string): Promise<import("./company.entity").Company | null>;
}
