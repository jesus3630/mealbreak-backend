import { Controller, Get, Post, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly service: JobsService) {}

  @Get('company/:companyId')
  findByCompany(@Param('companyId') companyId: string) {
    return this.service.findByCompany(+companyId);
  }

  @Post('refresh')
  triggerRefresh() {
    this.service.triggerRefresh();
    return { message: 'Job count refresh started in background' };
  }
}
