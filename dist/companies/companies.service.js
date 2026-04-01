"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("./company.entity");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let CompaniesService = class CompaniesService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async onApplicationBootstrap() {
        await this.seedFromStaticFiles();
    }
    async seedFromStaticFiles() {
        try {
            const dataPath = path.join(__dirname, '../../../companies_data.js');
            const websitesPath = path.join(__dirname, '../../../company_websites.js');
            if (!fs.existsSync(dataPath))
                return;
            let dataContent = fs.readFileSync(dataPath, 'utf8');
            let websitesContent = fs.existsSync(websitesPath)
                ? fs.readFileSync(websitesPath, 'utf8')
                : 'const COMPANY_WEBSITES = {};';
            const dataFn = new Function(dataContent + '; return COMPANIES;');
            const websitesFn = new Function(websitesContent + '; return COMPANY_WEBSITES;');
            const companies = dataFn();
            const websites = websitesFn();
            const guardCompanies = companies.filter(c => c.type && c.type.split(',').map((t) => t.trim()).includes('GUARD'));
            const batch = guardCompanies.map(c => ({
                name: c.name,
                city: c.city || undefined,
                state: c.state || undefined,
                zip: c.zip || undefined,
                phone: c.phone || undefined,
                type: c.type || undefined,
                employees: c.employees || undefined,
                license: c.license || undefined,
                expires: c.expires || undefined,
                website: websites[c.name] || undefined,
                careersUrl: undefined,
                jobCount: 0,
            }));
            await this.repo
                .createQueryBuilder()
                .insert()
                .into(company_entity_1.Company)
                .values(batch)
                .orIgnore()
                .execute();
            console.log(`Seeded ${batch.length} companies into database.`);
        }
        catch (err) {
            console.error('Seed error:', err.message);
        }
    }
    async findAll(filters) {
        const { state, zip, search, page = 1, limit = 24 } = filters;
        const qb = this.repo.createQueryBuilder('c');
        if (state)
            qb.andWhere('c.state = :state', { state });
        if (zip)
            qb.andWhere('c.zip LIKE :zip', { zip: `${zip}%` });
        if (search)
            qb.andWhere('c.name ILIKE :search', { search: `%${search}%` });
        qb.orderBy('c.name', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        return this.repo.findOne({ where: { id }, relations: ['jobs'] });
    }
    async updateCareersUrl(id, careersUrl) {
        await this.repo.update(id, { careersUrl });
        return this.repo.findOne({ where: { id } });
    }
    async updateJobCount(id, jobCount) {
        await this.repo.update(id, { jobCount, jobCountUpdatedAt: new Date() });
    }
    async getStates() {
        const rows = await this.repo
            .createQueryBuilder('c')
            .select('DISTINCT c.state', 'state')
            .where('c.state IS NOT NULL')
            .orderBy('c.state', 'ASC')
            .getRawMany();
        return rows.map(r => r.state);
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map