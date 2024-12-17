import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TICKET_STATUS {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  FIXED = 'fixed',
  CLOSED = 'closed',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null;

  @Column({ type: 'enum', enum: TICKET_STATUS })
  status: string;

  @Column({ type: 'blob', nullable: true, default: null })
  image: Buffer | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'assigned_at',
    default: null,
  })
  assignedAt: Date | null;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({ type: 'uuid', name: 'assigned_to' })
  assignedTo: string;

  @Column({ type: 'uuid', name: 'modified_by' })
  modifiedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  modifiedUser: User;
}
