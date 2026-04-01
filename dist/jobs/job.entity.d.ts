import { Company } from '../companies/company.entity';
export declare class Job {
    id: number;
    title: string;
    location: string;
    url: string;
    source: string;
    company: Company;
    createdAt: Date;
}
