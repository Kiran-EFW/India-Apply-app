import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UTRService, GenerateUTRDto } from './utr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('UTR')
@Controller('utr')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UTRController {
  constructor(private readonly utrService: UTRService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new UTR' })
  @ApiResponse({ status: 201, description: 'UTR generated successfully' })
  async generateUTR(@Body() generateUTRDto: GenerateUTRDto, @Request() req) {
    return this.utrService.generateUTR({
      ...generateUTRDto,
      userId: req.user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all UTRs for the current user' })
  @ApiResponse({ status: 200, description: 'UTRs retrieved successfully' })
  async getMyUTRs(@Request() req) {
    return this.utrService.findAllByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get UTR by ID' })
  @ApiResponse({ status: 200, description: 'UTR retrieved successfully' })
  async getUTR(@Param('id') id: string) {
    return this.utrService.findById(id);
  }

  @Get('number/:utrNumber')
  @ApiOperation({ summary: 'Get UTR by UTR number' })
  @ApiResponse({ status: 200, description: 'UTR retrieved successfully' })
  async getUTRByNumber(@Param('utrNumber') utrNumber: string) {
    return this.utrService.findByUTRNumber(utrNumber);
  }
}
