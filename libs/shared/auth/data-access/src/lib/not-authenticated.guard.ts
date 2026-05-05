import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { SupabaseService } from './supabase.service';

export const notAuthenticatedGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  return supabase.initialized$.pipe(
    filter(Boolean),
    take(1),
    map(() => !supabase.currentSession ? true : router.createUrlTree(['/portal']))
  );
};
