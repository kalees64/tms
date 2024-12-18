import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';

export interface PROFILE {
  id: string;
  profileName: string;
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  profiles!: PROFILE[];

  loading!: boolean;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private profileService: ProfileService,
    private userService: UserService
  ) {}

  async onRegister() {
    console.log(this.registerForm.value);
    this.startLoading();

    try {
      const res = await this.userService.register(this.registerForm.value);

      console.log(res.data);

      const user = res.data;

      if (user) {
        this.stopLoading();
        this.toast.success('Register Success! Login to continue');
        this.router.navigateByUrl('/login');
      }
    } catch (error: any) {
      this.stopLoading();
      console.log(error);
      this.toast.error('User already exists');
    }

    this.stopLoading();
  }

  async ngOnInit(): Promise<void> {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$'
          ),
        ],
      ],
      profileId: [null, Validators.required],
    });

    const profiles = await this.profileService.getProfiles();

    this.profiles = profiles.data;
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }

  get name() {
    return this.registerForm.controls['name'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get profileId() {
    return this.registerForm.controls['profileId'];
  }
}
