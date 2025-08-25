import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: await this.healthService.checkAllServices(),
    };
  }

  @Get('database')
  async checkDatabase() {
    return await this.healthService.checkDatabase();
  }

  @Get('elevenlabs')
  async checkElevenLabs() {
    return await this.healthService.checkElevenLabs();
  }

  @Get('razorpay')
  async checkRazorpay() {
    return await this.healthService.checkRazorpay();
  }

  @Get('azure-speech')
  async checkAzureSpeech() {
    return await this.healthService.checkAzureSpeech();
  }
}
