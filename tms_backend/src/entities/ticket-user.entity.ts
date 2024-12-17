import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

@Entity('tickets_x_users')
export class TicketUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'ticket_id' })
  ticketId: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Ticket)
  ticket: Ticket;
}
