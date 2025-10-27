import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTicketService } from './services/create-ticket.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GetUserTicketService } from './services/get-user-tickets.service';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateUserTicketService } from './services/update-ticket.service';


@UseGuards(JwtAuthGuard)
@Controller('support')
export class SupportController {
  constructor(
    private readonly createTicketService: CreateTicketService,
    private readonly getUserTicketService: GetUserTicketService,
    private readonly updateUserTicketService: UpdateUserTicketService,
  ) {}

  @Post('ticket')
  async createTicket(@CurrentUser() user: any, @Body() dto: CreateTicketDto) {
    const ticket = await this.createTicketService.createTicket(user.id, dto);

    return {
      success: true,
      message: 'Ticket created successfully',
      data: ticket,
    };
  }

  @Get('ticket/:ticketId')
  async getUserTicket(@CurrentUser() user: any, @Param('ticketId') ticketId: string) {
    console.log('Fetching ticket with ID:', ticketId, 'for user ID:', user.id);
    const ticket = await this.getUserTicketService.getUserTicket(user.id, ticketId);

    return { success: true, message: 'success', data: ticket };
  }

  
  @Get('ticket')
  async getAllUserTickets(@CurrentUser() user: any) {
    const tickets = await this.getUserTicketService.getAllUserTicket(user.id);  
    return { success: true, message: 'success', data: tickets };
  }

  @Patch('ticket/:ticketId')
  async updateUserTicket(@CurrentUser() user: any, @Param('ticketId') ticketId: string,  @Body() dto: UpdateTicketDto,) {
    const ticket = await this.updateUserTicketService.updateUserTicket(user.id, ticketId, dto);  
    return { success: true, message: 'update successful', data: ticket};
  }
}
