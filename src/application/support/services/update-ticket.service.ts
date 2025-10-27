import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { User } from '../../users/entities/user.entity';
import { UpdateTicketDto } from '../dto/update-ticket.dto';

@Injectable()
export class UpdateUserTicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateUserTicket(userId: string, ticketId: string, dto:UpdateTicketDto) {
    const ticket = await this.ticketRepository.findOne({
      where: { ticketId: ticketId, user: { id: userId } },
      relations: ['user'],
    }); 

    if (!ticket){
        throw new NotFoundException('Ticket not found');    
    }

    Object.assign(ticket, dto);

    return this.ticketRepository.save(ticket);

}

    
}