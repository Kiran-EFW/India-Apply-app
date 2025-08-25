import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus, ServiceType } from './application.entity';

export interface CreateApplicationDto {
  userId: string;
  serviceType: ServiceType;
  formData: any;
}

export interface UpdateApplicationDto {
  status?: ApplicationStatus;
  trackingNumber?: string;
  remarks?: string;
  paymentId?: string;
  utrNumber?: string;
}

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async createApplication(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const application = this.applicationRepository.create({
      ...createApplicationDto,
      status: ApplicationStatus.DRAFT,
    });
    return this.applicationRepository.save(application);
  }

  async findAllByUserId(userId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Application> {
    return this.applicationRepository.findOne({ where: { id } });
  }

  async updateApplication(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    await this.applicationRepository.update(id, updateApplicationDto);
    return this.findById(id);
  }

  async submitApplication(id: string): Promise<Application> {
    return this.updateApplication(id, { status: ApplicationStatus.SUBMITTED });
  }

  async generateTrackingNumber(id: string): Promise<Application> {
    const trackingNumber = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    return this.updateApplication(id, { trackingNumber });
  }

  async deleteApplication(id: string): Promise<void> {
    await this.applicationRepository.delete(id);
  }
}
