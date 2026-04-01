import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get('RESEND_API_KEY'));
  }

  async sendJobAlert(to: string, matches: { companyName: string; jobCount: number; careersUrl?: string; state?: string }[]) {
    if (!matches.length) return;

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
}
