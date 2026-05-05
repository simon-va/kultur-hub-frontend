import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

export const notAuthenticatedGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  if (!supabase.currentSession) {
    return true;
  }

  return router.createUrlTree(['/portal']);
};
