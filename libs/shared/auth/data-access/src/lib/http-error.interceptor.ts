import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorStateService } from '@kultur-hub/shared/util';
import { catchError, throwError } from 'rxjs';
import { SupabaseService } from './supabase.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorState = inject(ErrorStateService);
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            void supabase.signOut();
            errorState.showError('Session abgelaufen. Bitte melde dich erneut an.', 401);
            router.navigate(['/login']);
            break;

          case 403:
            errorState.showError('Keine Berechtigung für diese Aktion.', 403);
            break;

          case 500:
          case 0:
            errorState.showError(
              'Ein Server-Fehler ist aufgetreten. Bitte versuche es später erneut.',
              error.status
            );
            break;

          default:
            // Andere Fehler (z.B. 400 Validierungsfehler) werden nicht global angezeigt,
            // sondern können lokal in den Components behandelt werden.
            break;
        }
      }

      return throwError(() => error);
    })
  );
};
