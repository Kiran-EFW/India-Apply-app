import { Controller, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAvailableServices() {
    return await this.servicesService.getAvailableServices();
  }

  @Get(':id')
  async getServiceDetails(@Param('id') id: string) {
    return await this.servicesService.getServiceDetails(id);
  }
}
