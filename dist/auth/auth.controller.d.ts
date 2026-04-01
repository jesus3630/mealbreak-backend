import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        name?: string;
    }): Promise<{
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
    login(body: {
        email: string;
        password: string;
    }): Promise<{
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
