import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { User } from '../../users/entities/user.entity';  


@Injectable()
export class GetUserTicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}



    async getUserTicket(userId: string, ticketId: string) { 


        const ticket = await this.ticketRepository.findOne({
            where: { ticketId: ticketId, user: { id: userId } },
            relations: ['user'],
        });

        if (!ticket){
            throw new NotFoundException('Ticket not found');    
        }

        return ticket;

     }


     async getAllUserTicket(userId: string) { 


        const ticket = await this.ticketRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!ticket){
            throw new NotFoundException('Ticket not found');    
        }

        return ticket;

     }
     
     
}