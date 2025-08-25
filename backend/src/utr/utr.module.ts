import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UTRController } from './utr.controller';
import { UTRService } from './utr.service';
import { UTR } from './utr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UTR])],
  controllers: [UTRController],
  providers: [UTRService],
  exports: [UTRService],
})
export class UTRModule {}
