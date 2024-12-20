import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { TICKET, USER } from '../dashboard/dashboard.component';
import { PROFILE } from '../register/register.component';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-ticket-list',
  imports: [RouterLink, CommonModule, DataTablesModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css',
})
export class TicketListComponent implements OnInit {
  constructor(
    icons: FaIconLibrary,
    private userService: UserService,
    private router: Router,
    private ticketService: TicketService,
    private toast: ToastrService
  ) {
    icons.addIconPacks(fas);
  }

  user!: USER;

  userProfile!: PROFILE;

  tickets!: TICKET[];

  totalTickets!: number;

  pendingTickets!: number;

  inProgressTickets!: number;

  solvedTickets!: number;

  dtOptions: Config = {};

  async ngOnInit(): Promise<void> {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };

    this.user = await this.userService.getUserFromLocalStorage();

    this.userProfile = await this.userService.getUserRoleFromLocalStorage();

    const res = await this.ticketService.getTickets();

    if (this.userProfile.profileName === 'stakeholder') {
      this.tickets = res.data.filter(
        (ticket: TICKET) =>
          ticket.createdBy.id === this.user.id ||
          ticket.assignedTo.id === this.user.id
      );

      this.pendingTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'open'
      ).length;

      this.inProgressTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'in_progress'
      ).length;

      this.solvedTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'closed'
      ).length;
    }

    if (this.userProfile.profileName === 'manager') {
      this.tickets = res.data;

      this.pendingTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'open'
      ).length;

      this.inProgressTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'in_progress'
      ).length;

      this.solvedTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'closed'
      ).length;
    }

    if (this.userProfile.profileName === 'it_team') {
      this.tickets = res.data.filter(
        (ticket: TICKET) =>
          ticket.createdBy.id === this.user.id ||
          ticket.assignedTo.id === this.user.id
      );

      this.pendingTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'in_progress'
      ).length;

      this.solvedTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'fixed'
      ).length;
    }
  }

  navigateToCreateTicketPage() {
    this.router.navigateByUrl('/create-ticket');
  }

  async approveTicket(id: string, userId: string): Promise<void> {
    await this.ticketService.updateTicket(id, 'IN_PROGRESS', userId);
    this.toast.success('Ticket Approved!');
    this.ngOnInit();
  }

  async rejectTicket(id: string, userId: string): Promise<void> {
    await this.ticketService.updateTicket(id, 'CANCELLED', userId);
    this.toast.success('Ticket Rejected!');
    this.ngOnInit();
  }

  async closeTicket(id: string, userId: string): Promise<void> {
    await this.ticketService.updateTicket(id, 'CLOSED', userId);
    this.toast.success('Ticket Closed!');
    this.ngOnInit();
  }

  async fixTicket(id: string, userId: string): Promise<void> {
    await this.ticketService.updateTicket(id, 'FIXED', userId);
    this.toast.success('Ticket Fixed! And send to the review');
    this.ngOnInit();
  }
}
