import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CREATE_TICKET {
  title: string;
  description?: string | null;
  image?: string | null;
  assignedAt?: string | null;
  status: string;
  createdBy: string;
  modifiedBy: string;
  assignedTo: string;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  apiUrl = environment.API_URI;

  constructor(private http: HttpClient) {}

  async getTickets(): Promise<any> {
    const url = `${this.apiUrl}/tickets`;
    return await firstValueFrom(this.http.get(url));
  }

  async getTicket(id: string): Promise<any> {
    const url = `${this.apiUrl}/tickets/${id}`;
    return await firstValueFrom(this.http.get(url));
  }

  async createTicket(ticketData: CREATE_TICKET): Promise<any> {
    const url = `${this.apiUrl}/tickets`;

    return await firstValueFrom(this.http.post(url, ticketData));
  }

  async updateTicket(
    id: string,
    status: string,
    modifiedBy: string
  ): Promise<any> {
    const url = `${this.apiUrl}/tickets/${id}`;

    return await firstValueFrom(this.http.patch(url, { status, modifiedBy }));
  }
}
