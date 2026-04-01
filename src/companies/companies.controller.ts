import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Get()
  findAll(
    @Query('state') state?: string,
    @Query('zip') zip?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll({
      state,
      zip,
      search,
      page: page ? +page : 1,
      limit: limit ? +limit : 24,
    });
  }

  @Get('states')
  getStates() {
    return this.service.getStates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id/careers-url')
  updateCareersUrl(@Param('id') id: string, @Body('careersUrl') careersUrl: string) {
    return this.service.updateCareersUrl(+id, careersUrl);
  }
}
