import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';
import { UserService } from '../../services/user.service';
import { PROFILE } from '../register/register.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '../loading/loading.component';

export interface USER {
  id: string;
  name: string;
  email: string;
  profiles: PROFILE[];
  createdAt: string;
  modifiedAt: string;
}

export interface TICKET {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  createdAt: string;
  modifiedAt: string;
  assignedAt?: string | null;
  status: string;
  createdBy: { id: string; name: string; email: string };
  modifiedBy: { id: string; name: string; email: string };
  assignedTo: { id: string; name: string; email: string };
}

export enum PROFILES {
  STAKEHOLDER = 'stakeholder',
  MANAGER = 'manager',
  IT_TEAM = 'it_team',
}

@Component({
  selector: 'app-dashboard',
  imports: [
    FontAwesomeModule,
    DataTablesModule,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
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

  fixedTickets!: number;

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

      this.fixedTickets = this.tickets.filter(
        (ticket: TICKET) => ticket.status === 'fixed'
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
        (ticket: TICKET) =>
          ticket.status === 'fixed' || ticket.status === 'closed'
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
