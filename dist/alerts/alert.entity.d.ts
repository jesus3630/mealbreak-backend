import { User } from '../users/user.entity';
export declare class Alert {
    id: number;
    user: User;
    state: string;
    zip: string;
    companyName: string;
    jobTitle: string;
    active: boolean;
    createdAt: Date;
}
