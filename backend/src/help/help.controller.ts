import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HelpService } from './help.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  // FAQ Endpoints
  @Get('faqs')
  async getFAQs(@Query('category') category?: string) {
    return await this.helpService.getFAQs(category);
  }

  @Get('faqs/:id')
  async getFAQById(@Param('id') id: string) {
    return await this.helpService.getFAQById(id);
  }

  @Get('search')
  async searchFAQs(@Query('q') query: string) {
    return await this.helpService.searchFAQs(query);
  }

  // Support Ticket Endpoints
  @Post('tickets')
  @UseGuards(JwtAuthGuard)
  async createSupportTicket(@Body() ticketData: any, @Request() req) {
    return await this.helpService.createSupportTicket(req.user.id, ticketData);
  }

  @Get('tickets/:id')
  @UseGuards(JwtAuthGuard)
  async getSupportTicket(@Param('id') id: string) {
    return await this.helpService.getSupportTicket(id);
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  async getUserSupportTickets(@Request() req) {
    return await this.helpService.getUserSupportTickets(req.user.id);
  }

  @Put('tickets/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateTicketStatus(@Param('id') id: string, @Body() statusData: { status: string }) {
    return await this.helpService.updateTicketStatus(id, statusData.status);
  }

  // Ticket Response Endpoints
  @Post('tickets/:id/responses')
  @UseGuards(JwtAuthGuard)
  async addTicketResponse(@Param('id') ticketId: string, @Body() responseData: any) {
    return await this.helpService.addTicketResponse(ticketId, responseData);
  }

  @Get('tickets/:id/responses')
  @UseGuards(JwtAuthGuard)
  async getTicketResponses(@Param('id') ticketId: string) {
    return await this.helpService.getTicketResponses(ticketId);
  }

  // Analytics Endpoints
  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getHelpAnalytics() {
    return await this.helpService.getHelpAnalytics();
  }
}
