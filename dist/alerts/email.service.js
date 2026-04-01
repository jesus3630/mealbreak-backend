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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let EmailService = class EmailService {
    config;
    resend;
    constructor(config) {
        this.config = config;
        this.resend = new resend_1.Resend(this.config.get('RESEND_API_KEY'));
    }
    async sendJobAlert(to, matches) {
        if (!matches.length)
            return;
        const rows = matches.map(m => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e8eeec;">
          <strong style="font-family:Montserrat,Arial,sans-serif;color:#1a2e2b;">${m.companyName}</strong>
          ${m.state ? `<span style="color:#4a6360;font-size:13px;"> — ${m.state}</span>` : ''}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e8eeec;text-align:center;">
          <strong style="color:#18958a;">${m.jobCount > 0 ? m.jobCount + ' open' : 'Hiring'}</strong>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e8eeec;text-align:center;">
          <a href="${m.careersUrl || '#'}" style="background:#e8704a;color:white;padding:6px 14px;border-radius:50px;font-size:12px;font-weight:700;text-decoration:none;font-family:Montserrat,Arial,sans-serif;">
            View Jobs →
          </a>
        </td>
      </tr>
    `).join('');
        await this.resend.emails.send({
            from: 'MealBreak Jobs <jobs@mealbreak.io>',
            to,
            subject: `🔔 ${matches.length} new job match${matches.length > 1 ? 'es' : ''} — MealBreak`,
            html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#0a4840,#18958a);padding:32px;text-align:center;border-radius:12px 12px 0 0;">
            <h1 style="font-family:Montserrat,Arial,sans-serif;color:white;margin:0;font-size:24px;">
              Meal<span style="opacity:0.72;">Break</span> Job Alert
            </h1>
          </div>
          <div style="background:white;padding:32px;border:1px solid #e8eeec;">
            <p style="color:#4a6360;font-size:15px;">New positions matching your saved alerts:</p>
            <table style="width:100%;border-collapse:collapse;margin-top:16px;">
              <thead>
                <tr style="background:#f7f9f8;">
                  <th style="padding:10px 16px;text-align:left;font-family:Montserrat,Arial,sans-serif;font-size:12px;color:#4a6360;text-transform:uppercase;letter-spacing:1px;">Company</th>
                  <th style="padding:10px 16px;text-align:center;font-family:Montserrat,Arial,sans-serif;font-size:12px;color:#4a6360;text-transform:uppercase;letter-spacing:1px;">Jobs</th>
                  <th style="padding:10px 16px;text-align:center;font-family:Montserrat,Arial,sans-serif;font-size:12px;color:#4a6360;text-transform:uppercase;letter-spacing:1px;">Apply</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
          <div style="background:#f7f9f8;padding:20px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e8eeec;border-top:none;">
            <p style="font-size:12px;color:#4a6360;margin:0;">
              You're receiving this because you set up a job alert on MealBreak.<br>
              <a href="#" style="color:#18958a;">Manage alerts</a>
            </p>
          </div>
        </div>
      `,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map