"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const job_entity_1 = require("./job.entity");
const companies_service_1 = require("../companies/companies.service");
const axios_1 = __importDefault(require("axios"));
let JobsService = JobsService_1 = class JobsService {
    repo;
    companiesService;
    logger = new common_1.Logger(JobsService_1.name);
    constructor(repo, companiesService) {
        this.repo = repo;
        this.companiesService = companiesService;
    }
    async findByCompany(companyId) {
        return this.repo.find({ where: { company: { id: companyId } }, order: { createdAt: 'DESC' } });
    }
    async refreshJobCounts() {
        this.logger.log('Starting job count refresh...');
        const { data: companies } = await this.companiesService.findAll({ limit: 9999 });
        let updated = 0;
        for (const company of companies) {
            try {
                const count = await this.fetchJobCount(company.name, company.state);
                if (count !== null) {
                    await this.companiesService.updateJobCount(company.id, count);
                    updated++;
                }
                await new Promise(r => setTimeout(r, 500));
            }
            catch {
            }
        }
        this.logger.log(`Job count refresh complete. Updated ${updated} companies.`);
    }
    async fetchJobCount(companyName, state) {
        try {
            const q = encodeURIComponent(`"${companyName}"`);
            const l = state ? encodeURIComponent(state) : '';
            const url = `https://www.indeed.com/jobs?q=${q}&l=${l}&limit=1`;
            const response = await axios_1.default.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                timeout: 8000,
            });
            const html = response.data;
            const patterns = [
                /(\d[\d,]*)\s+jobs?\s+found/i,
                /"jobCount"\s*:\s*(\d+)/,
                /(\d[\d,]*)\s+results/i,
                /Showing\s+\d+\s+of\s+([\d,]+)/i,
            ];
            for (const pattern of patterns) {
                const match = html.match(pattern);
                if (match)
                    return parseInt(match[1].replace(/,/g, ''), 10);
            }
            return 0;
        }
        catch {
            return null;
        }
    }
    async triggerRefresh() {
        return this.refreshJobCounts();
    }
};
exports.JobsService = JobsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "refreshJobCounts", null);
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        companies_service_1.CompaniesService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map