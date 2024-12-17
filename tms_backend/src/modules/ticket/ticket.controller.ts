import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getTickets(): Promise<{ data: any }> {
    return await this.ticketService.getTickets();
  }

  @Get('/:id')
  async getTicket(@Param('id') id: string): Promise<{ data: any }> {
    return await this.ticketService.getTicket(id);
  }

  @Post()
  async createTicket(
    @Body() ticketData: CreateTicketDto,
  ): Promise<{ data: any }> {
    return await this.ticketService.createTicket(ticketData);
  }

  @Patch('/:id')
  async updateTicket(
    @Param('id') id: string,
    @Body() ticketData: UpdateTicketDto,
  ): Promise<{ data: any }> {
    return await this.ticketService.updateTicket(id, ticketData);
  }

  @Delete('/:id')
  async deleteTicket(@Param('id') id: string): Promise<{ data: any }> {
    return await this.ticketService.deleteTicket(id);
  }
}
