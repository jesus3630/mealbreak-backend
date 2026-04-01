import { UsersService } from './users.service';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    getProfile(req: any): any;
    saveCompany(req: any, companyId: string): Promise<number[]>;
    unsaveCompany(req: any, companyId: string): Promise<number[]>;
    saveSearch(req: any, search: string): Promise<string[]>;
}
