import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    create(email: string, password: string, name?: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    saveCompany(userId: number, companyId: number): Promise<number[]>;
    unsaveCompany(userId: number, companyId: number): Promise<number[]>;
    saveSearch(userId: number, search: string): Promise<string[]>;
}
