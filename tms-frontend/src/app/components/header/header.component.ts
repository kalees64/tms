import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user!: any;

  loading!: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
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
