import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application } from './application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
