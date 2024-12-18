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
import { Router } from '@angular/router';

export interface USER {
  id: string;
  name: string;
  email: string;
  profiles: PROFILE[];
  createdAt: string;
  modifiedAt: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [FontAwesomeModule, DataTablesModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    icons: FaIconLibrary,
    private userService: UserService,
    private router: Router
  ) {
    icons.addIconPacks(fas);
  }

  user!: USER;

  userProfile!: PROFILE;

  dtOptions: Config = {};

  async ngOnInit(): Promise<void> {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };

    this.user = await this.userService.getUserFromLocalStorage();

    this.userProfile = await this.userService.getUserRoleFromLocalStorage();
  }

  navigateToCreateTicketPage() {
    this.router.navigateByUrl('/create-ticket');
  }
}
