import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { UserService } from './user.service';

export const adminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.ready$.pipe(
    filter(Boolean),
    take(1),
    map(() => userService.isAdmin() ? true : router.createUrlTree(['/portal']))
  );
};
