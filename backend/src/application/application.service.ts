import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async createApplication(userId: string, serviceType: string, data: any) {
    try {
      const application = this.applicationRepository.create({
        userId,
        serviceType,
        status: 'submitted',
        data,
        submittedAt: new Date(),
      });

      return await this.applicationRepository.save(application);
    } catch (error) {
      console.error('Application creation error:', error);
      throw new Error('Failed to create application');
    }
  }

  async getApplicationById(id: string) {
    try {
      return await this.applicationRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Application fetch error:', error);
      throw new Error('Failed to fetch application');
    }
  }

  async getApplicationsByUser(userId: string) {
    try {
      return await this.applicationRepository.find({ where: { userId } });
    } catch (error) {
      console.error('Applications fetch error:', error);
      throw new Error('Failed to fetch applications');
    }
  }

  async updateApplicationStatus(id: string, status: string) {
    try {
      await this.applicationRepository.update(id, { status });
      return await this.getApplicationById(id);
    } catch (error) {
      console.error('Application status update error:', error);
      throw new Error('Failed to update application status');
    }
  }

  async getApplicationStatus(id: string) {
    try {
      const application = await this.getApplicationById(id);
      if (!application) {
        throw new Error('Application not found');
      }

      return {
        status: application.status,
        data: application.data,
        updatedAt: application.updatedAt,
      };
    } catch (error) {
      console.error('Status check error:', error);
      throw new Error('Failed to get application status');
    }
  }
}
