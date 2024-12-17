import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TICKET_STATUS } from 'src/entities/ticket.entity';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  status: TICKET_STATUS;

  @IsOptional()
  image: Buffer;

  @IsOptional()
  assignedAt: Date;

  @IsNotEmpty()
  @IsUUID()
  createdBy: string;

  @IsNotEmpty()
  @IsUUID()
  assignedTo: string;

  @IsNotEmpty()
  @IsUUID()
  modifiedBy: string;
}
