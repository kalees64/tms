import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'create-ticket',
    component: CreateTicketComponent,
  },

  //   {
  //     path: '',
  //     redirectTo: 'dashboard',
  //     pathMatch: 'full',
  //   },
];
