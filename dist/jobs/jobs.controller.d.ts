import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly service;
    constructor(service: JobsService);
    findByCompany(companyId: string): Promise<import("./job.entity").Job[]>;
    triggerRefresh(): {
        message: string;
    };
}
