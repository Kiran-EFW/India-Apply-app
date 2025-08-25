import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationService, CreateApplicationDto, UpdateApplicationDto } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({ status: 201, description: 'Application created successfully' })
  async createApplication(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    return this.applicationService.createApplication({
      ...createApplicationDto,
      userId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications for the current user' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getMyApplications(@Request() req) {
    return this.applicationService.findAllByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, description: 'Application retrieved successfully' })
  async getApplication(@Param('id') id: string) {
    return this.applicationService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update application' })
  @ApiResponse({ status: 200, description: 'Application updated successfully' })
  async updateApplication(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.updateApplication(id, updateApplicationDto);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit application' })
  @ApiResponse({ status: 200, description: 'Application submitted successfully' })
  async submitApplication(@Param('id') id: string) {
    return this.applicationService.submitApplication(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete application' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  async deleteApplication(@Param('id') id: string) {
    return this.applicationService.deleteApplication(id);
  }
}
