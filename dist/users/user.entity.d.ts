import { Alert } from '../alerts/alert.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    state: string;
    zip: string;
    savedCompanies: number[];
    savedSearches: string[];
    alerts: Alert[];
    createdAt: Date;
}
