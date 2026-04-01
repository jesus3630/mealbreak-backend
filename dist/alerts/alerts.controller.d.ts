import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly service;
    constructor(service: AlertsService);
    findAll(req: any): Promise<import("./alert.entity").Alert[]>;
    create(req: any, body: {
        state?: string;
        zip?: string;
        companyName?: string;
        jobTitle?: string;
    }): Promise<import("./alert.entity").Alert>;
    delete(req: any, id: string): Promise<void>;
}
