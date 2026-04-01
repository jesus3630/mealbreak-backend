import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly service: AlertsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.service.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() body: { state?: string; zip?: string; companyName?: string; jobTitle?: string }) {
    return this.service.create(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return this.service.delete(+id, req.user.id);
  }
}
