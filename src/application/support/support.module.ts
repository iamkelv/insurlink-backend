import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { CreateTicketService } from './services/create-ticket.service';
import { GetUserTicketService } from './services/get-user-tickets.service';
import { UpdateUserTicketService } from './services/update-ticket.service';     
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, User])],
  providers: [CreateTicketService, GetUserTicketService, UpdateUserTicketService],
  controllers: [SupportController]
})
export class SupportModule {}
