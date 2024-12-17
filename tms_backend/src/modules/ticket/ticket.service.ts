import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketUser } from 'src/entities/ticket-user.entity';
import { Ticket } from 'src/entities/ticket.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketUser)
    private readonly ticketUserRepo: Repository<TicketUser>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getTickets(): Promise<{ data: any[] }> {
    const tickets = await this.ticketRepo.find({
      relations: ['createdUser', 'modifiedUser', 'assignedUser'],
    });

    const transformedTicketsData = tickets.map((ticket) => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      image: ticket.image,
      createdAt: ticket.createdAt,
      modifiedAt: ticket.modifiedAt,
      assignedAt: ticket.assignedAt,
      createdBy: {
        id: ticket.createdUser.id,
        name: ticket.createdUser.name,
        email: ticket.createdUser.email,
      },
      modifiedBy: {
        id: ticket.modifiedUser.id,
        name: ticket.modifiedUser.name,
        email: ticket.modifiedUser.email,
      },
      assignedTo: {
        id: ticket.assignedUser.id,
        name: ticket.assignedUser.name,
        email: ticket.assignedUser.email,
      },
    }));

    return { data: transformedTicketsData };
  }

  async getTicket(id: string): Promise<{ data: any }> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['createdUser', 'modifiedUser', 'assignedUser'],
    });

    if (!ticket) {
      throw new NotFoundException();
    }

    const transformedTicketData = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      image: ticket.image,
      createdAt: ticket.createdAt,
      modifiedAt: ticket.modifiedAt,
      assignedAt: ticket.assignedAt,
      createdBy: {
        id: ticket.createdUser.id,
        name: ticket.createdUser.name,
        email: ticket.createdUser.email,
      },
      modifiedBy: {
        id: ticket.modifiedUser.id,
        name: ticket.modifiedUser.name,
        email: ticket.modifiedUser.email,
      },
      assignedTo: {
        id: ticket.assignedUser.id,
        name: ticket.assignedUser.name,
        email: ticket.assignedUser.email,
      },
    };

    return { data: transformedTicketData };
  }

  async createTicket(ticketData: CreateTicketDto): Promise<{ data: any }> {
    const createTicket = await this.ticketRepo.create(ticketData);

    const user = await this.userRepo.findOne({
      where: { id: ticketData.createdBy },
    });

    if (!user) {
      throw new BadRequestException();
    }

    const newTicket = await this.ticketRepo.save(createTicket);

    const createTicketUser = await this.ticketUserRepo.create({
      ticket: newTicket,
      ticketId: newTicket.id,
      user: user,
      userId: ticketData.createdBy,
    });

    const newTicketUser = await this.ticketUserRepo.save(createTicketUser);

    return { data: newTicket };
  }

  async updateTicket(id: string, ticketData: UpdateTicketDto) {
    const updateTicket = await this.ticketRepo.update(id, ticketData);

    const ticket = await this.getTicket(id);

    return ticket;
  }

  async deleteTicket(id: string): Promise<{ data: any }> {
    const ticket = await this.getTicket(id);

    await this.ticketRepo.delete(id);

    return ticket;
  }
}
