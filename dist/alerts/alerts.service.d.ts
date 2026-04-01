import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
export declare class AlertsService {
    private repo;
    constructor(repo: Repository<Alert>);
    create(userId: number, dto: Partial<Alert>): Promise<Alert>;
    findByUser(userId: number): Promise<Alert[]>;
    delete(id: number, userId: number): Promise<void>;
}
