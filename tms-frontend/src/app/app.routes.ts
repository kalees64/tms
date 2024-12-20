import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardLayoutComponent } from './components/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { ViewTicketComponent } from './components/view-ticket/view-ticket.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'create-ticket',
        component: CreateTicketComponent,
        canActivate: [authGuard, roleGuard],
      },
      {
        path: 'tickets',
        component: TicketListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'view-ticket/:id',
        component: ViewTicketComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
