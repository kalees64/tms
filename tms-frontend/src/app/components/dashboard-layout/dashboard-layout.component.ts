import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import { TicketService } from '../../services/ticket.service';
import { USER } from '../dashboard/dashboard.component';
import { PROFILE } from '../register/register.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-layout',
  imports: [FontAwesomeModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  constructor(
    icons: FaIconLibrary,
    private userService: UserService,
    private router: Router,
    private ticketService: TicketService
  ) {
    icons.addIconPacks(fas);
  }

  user!: USER;

  userProfile!: PROFILE;

  loading!: boolean;

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUserFromLocalStorage();

    this.userProfile = await this.userService.getUserRoleFromLocalStorage();

    const res = await this.ticketService.getTickets();
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  logout() {
    this.startLoading();
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userData');
        this.userService.user.set(null);
        // this.toast.success('Logged out!');
        this.navigate('/login');
        Swal.fire({
          title: 'Loggedout!',
          text: 'You are logged out successfully',
          icon: 'success',
        });
        this.stopLoading();
      }
    });
    this.stopLoading();
  }
}
