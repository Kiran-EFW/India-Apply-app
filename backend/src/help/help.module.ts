import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { FAQ, SupportTicket, TicketResponse } from './help.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FAQ, SupportTicket, TicketResponse])],
  controllers: [HelpController],
  providers: [HelpService],
  exports: [HelpService],
})
export class HelpModule {}
