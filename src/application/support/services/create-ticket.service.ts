import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Injectable, ConflictException, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { Ticket } from '../entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class CreateTicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTicket(userId: string, dto: CreateTicketDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new ConflictException('User does not exist');
    }

    const ticket = this.ticketRepository.create({
      subject: dto.subject,
      message: dto.message,
      user: user,
      ticketId: await this.generateTicketId(),
    }); 

    return this.ticketRepository.save(ticket);

  }


   async generateTicketId() {
    const now = new Date();
    const datePart = now.toISOString().slice(0,10).replace(/-/g, ''); // YYYYMMDD
    const timePart = now.toTimeString().slice(0,8).replace(/:/g, ''); // HHMMSS
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // random 6 chars

    return `TCK-${datePart}-${timePart}-${randomPart}`;
  }
}
