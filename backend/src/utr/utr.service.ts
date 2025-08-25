import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UTR } from './utr.entity';

@Injectable()
export class UTRService {
  constructor(
    @InjectRepository(UTR)
    private utrRepository: Repository<UTR>,
  ) {}

  async generateUTR(userId: string, paymentDetails: any) {
    try {
      // Generate a unique UTR (Unique Transaction Reference)
      const utrNumber = this.generateUTRNumber();
      
      const utr = this.utrRepository.create({
        userId,
        utrNumber,
        paymentId: paymentDetails.paymentId,
        orderId: paymentDetails.orderId,
        amount: paymentDetails.amount,
        description: paymentDetails.description,
        status: 'success',
        createdAt: new Date(),
      });

      return await this.utrRepository.save(utr);
    } catch (error) {
      console.error('UTR generation error:', error);
      throw new Error('Failed to generate UTR');
    }
  }

  async getUTRByNumber(utrNumber: string) {
    try {
      return await this.utrRepository.findOne({ where: { utrNumber } });
    } catch (error) {
      console.error('UTR fetch error:', error);
      throw new Error('Failed to fetch UTR');
    }
  }

  async getUserUTRs(userId: string) {
    try {
      return await this.utrRepository.find({ where: { userId } });
    } catch (error) {
      console.error('UTRs fetch error:', error);
      throw new Error('Failed to fetch UTRs');
    }
  }

  private generateUTRNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `UTR${timestamp.slice(-6)}${random}`;
  }
}
