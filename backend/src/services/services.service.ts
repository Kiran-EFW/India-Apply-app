import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
  async getAvailableServices() {
    return [
      {
        id: 'passport',
        name: 'Passport Services',
        description: 'Apply for new passport, renewal, or update details',
        icon: '📄',
        requirements: ['Aadhaar Card', 'PAN Card', 'Address Proof'],
        processingTime: '15-20 days',
        fee: '₹1500',
      },
      {
        id: 'pan',
        name: 'PAN Card Services',
        description: 'Apply for new PAN, update details, or reprint',
        icon: '💳',
        requirements: ['Aadhaar Card', 'Address Proof'],
        processingTime: '7-10 days',
        fee: '₹93',
      },
      {
        id: 'aadhaar',
        name: 'Aadhaar Services',
        description: 'Update address, mobile number, or other details',
        icon: '🆔',
        requirements: ['Existing Aadhaar', 'Address Proof'],
        processingTime: '5-7 days',
        fee: '₹50',
      },
      {
        id: 'tax',
        name: 'Tax Services',
        description: 'File ITR, generate UTR, or check refund status',
        icon: '🧾',
        requirements: ['PAN Card', 'Bank Details'],
        processingTime: 'Immediate',
        fee: '₹0',
      },
    ];
  }

  async getServiceDetails(serviceId: string) {
    const services = await this.getAvailableServices();
    return services.find(service => service.id === serviceId);
  }
}
