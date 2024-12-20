import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FontAwesomeModule,
    LoadingComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  loading!: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toast: ToastrService,
    private router: Router,
    icons: FaIconLibrary
  ) {
    icons.addIconPacks(fas);
  }

  async onLogin() {
    console.log(this.loginForm.value);
    this.startLoading();
    try {
      const user = await this.userService.login(this.loginForm.value);

      if (!user) {
        this.stopLoading();
        return this.toast.error('Invalid credentials');
      }

      localStorage.setItem('userData', JSON.stringify(user));

      this.userService.user.set(user.user);

      this.toast.success(`Welcome ${user.user.name}`);
      this.stopLoading();

      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      console.log(error);
      this.stopLoading();
      if (error.status === 404) {
        this.stopLoading();
        return this.toast.error('Invalid credentials');
      }
    }
    this.stopLoading();
    return true;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }
}
