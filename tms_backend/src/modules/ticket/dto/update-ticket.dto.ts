import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TICKET_STATUS } from 'src/entities/ticket.entity';

export class UpdateTicketDto {
  @IsNotEmpty()
  @IsString()
  status: TICKET_STATUS;

  @IsNotEmpty()
  @IsUUID()
  modifiedBy: string;
}
