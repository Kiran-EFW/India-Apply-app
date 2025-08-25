import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { UTR } from '../utr/utr.entity';
import { Application } from '../application/application.entity';
import { FAQ, SupportTicket, TicketResponse } from '../help/help.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  entities: [User, UTR, Application, FAQ, SupportTicket, TicketResponse],
  synchronize: configService.get('node.env') === 'development',
  logging: configService.get('node.env') === 'development',
});
