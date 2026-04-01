import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private config;
    private resend;
    constructor(config: ConfigService);
    sendJobAlert(to: string, matches: {
        companyName: string;
        jobCount: number;
        careersUrl?: string;
        state?: string;
    }[]): Promise<void>;
}
