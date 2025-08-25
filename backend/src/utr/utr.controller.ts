import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UTRService } from './utr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('utr')
export class UTRController {
  constructor(private readonly utrService: UTRService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateUTR(@Body() paymentDetails: any, @Request() req) {
    return await this.utrService.generateUTR(req.user.id, paymentDetails);
  }

  @Get(':utrNumber')
  @UseGuards(JwtAuthGuard)
  async getUTR(@Param('utrNumber') utrNumber: string) {
    return await this.utrService.getUTRByNumber(utrNumber);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserUTRs(@Request() req) {
    return await this.utrService.getUserUTRs(req.user.id);
  }
}
