import { Job } from '../jobs/job.entity';
export declare class Company {
    id: number;
    name: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    type: string;
    employees: string;
    license: string;
    expires: string;
    website: string;
    careersUrl: string;
    jobCount: number;
    jobCountUpdatedAt: Date;
    jobs: Job[];
    createdAt: Date;
    updatedAt: Date;
}
