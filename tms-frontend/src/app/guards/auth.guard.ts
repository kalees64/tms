import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const toast = inject(ToastrService);
  const router = inject(Router);
  const userId = await userService.getUserIdFromLocalStorage();
  if (userId) {
    return true;
  } else {
    toast.error('You are not logged in, please login');
    setTimeout(() => {
      router.navigateByUrl('/login');
    }, 2000);
    return false;
  }
};
