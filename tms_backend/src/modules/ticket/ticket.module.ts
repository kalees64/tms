import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket.entity';
import { TicketUser } from 'src/entities/ticket-user.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketUser, User])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
