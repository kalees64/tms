import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TICKET } from '../dashboard/dashboard.component';
import { TicketService } from '../../services/ticket.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-ticket',
  imports: [],
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.css',
})
export class ViewTicketComponent implements OnInit {
  ticketId!: string;

  ticket!: TICKET;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private ticketService: TicketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.ticketId = this.route.snapshot.params['id'];

    const res = await this.ticketService.getTicket(this.ticketId);

    this.ticket = res.data;
  }

  goBack() {
    this.location.back();
  }
}
