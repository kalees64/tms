import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const toast = inject(ToastrService);
  const userRole = userService.getUserRoleAuthFromLocalStorage();
  if (userRole.profileName === 'stakeholder') {
    return true;
  } else {
    toast.error('Only stakeholders have access to all tasks');
    router.navigateByUrl('/dashboard');
    return false;
  }
};
