import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(email: string, password: string, name?: string): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
            state: string;
            zip: string;
            savedCompanies: number[];
            savedSearches: string[];
            alerts: import("../alerts/alert.entity").Alert[];
            createdAt: Date;
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
            state: string;
            zip: string;
            savedCompanies: number[];
            savedSearches: string[];
            alerts: import("../alerts/alert.entity").Alert[];
            createdAt: Date;
        };
        token: string;
    }>;
}
