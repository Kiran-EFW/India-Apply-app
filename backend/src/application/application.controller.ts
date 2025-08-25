import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':serviceType')
  @UseGuards(JwtAuthGuard)
  async submitApplication(
    @Param('serviceType') serviceType: string,
    @Body() applicationData: any,
    @Request() req,
  ) {
    return await this.applicationService.createApplication(
      req.user.id,
      serviceType,
      applicationData,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserApplications(@Request() req) {
    return await this.applicationService.getApplicationsByUser(req.user.id);
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  async getApplicationStatus(@Param('id') id: string) {
    return await this.applicationService.getApplicationStatus(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getApplication(@Param('id') id: string) {
    return await this.applicationService.getApplicationById(id);
  }
}
