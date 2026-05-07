import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { OrganisationsStore } from './organisations.store';

export const hasOrganisationGuard: CanActivateFn = () => {
  const store = inject(OrganisationsStore);
  const router = inject(Router);
  return toObservable(store.hasLoaded).pipe(
    filter(Boolean),
    take(1),
    map(() =>
      store.organisations().length > 0 ? true : router.parseUrl('/portal/setup')
    )
  );
};
