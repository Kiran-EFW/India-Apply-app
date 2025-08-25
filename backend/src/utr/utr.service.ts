import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UTR } from './utr.entity';

export interface GenerateUTRDto {
  userId: string;
  amount: number;
  purpose: string;
}

@Injectable()
export class UTRService {
  constructor(
    @InjectRepository(UTR)
    private utrRepository: Repository<UTR>,
  ) {}

  async generateUTR(generateUTRDto: GenerateUTRDto): Promise<UTR> {
    // Generate a unique UTR number
    const utrNumber = this.generateUTRNumber();
    
    const utr = this.utrRepository.create({
      ...generateUTRDto,
      utrNumber,
      status: 'generated',
    });

    return this.utrRepository.save(utr);
  }

  async findAllByUserId(userId: string): Promise<UTR[]> {
    return this.utrRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<UTR> {
    return this.utrRepository.findOne({ where: { id } });
  }

  async findByUTRNumber(utrNumber: string): Promise<UTR> {
    return this.utrRepository.findOne({ where: { utrNumber } });
  }

  private generateUTRNumber(): string {
    // Generate a unique UTR number
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `UTR${timestamp}${random}`;
  }
}
