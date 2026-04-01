import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    const { password, ...user } = req.user;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('saved-companies/:companyId')
  saveCompany(@Request() req, @Param('companyId') companyId: string) {
    return this.service.saveCompany(req.user.id, +companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('saved-companies/:companyId')
  unsaveCompany(@Request() req, @Param('companyId') companyId: string) {
    return this.service.unsaveCompany(req.user.id, +companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saved-searches')
  saveSearch(@Request() req, @Body('search') search: string) {
    return this.service.saveSearch(req.user.id, search);
  }
}
