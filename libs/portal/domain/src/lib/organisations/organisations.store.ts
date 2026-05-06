import { computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStore, withProps } from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';
import { Client, CreateOrganisationRequest, OrganisationResponse } from '@kultur-hub/shared/api';
import { UserService } from '@kultur-hub/shared/auth/data-access';

export const OrganisationsStore = signalStore(
  { providedIn: 'root' },
  withProps(() => {
    const client = inject(Client);
    const userService = inject(UserService);
    const resource = rxResource<OrganisationResponse[], string | undefined>({
      params: () => userService.currentUser()?.id,
      stream: () => client.organisationsAll(),
    });
    return {
      organisations: computed(() => resource.value() ?? []),
      loading: resource.isLoading,
      hasLoaded: computed(() => resource.value() !== undefined),
      createOrganisation: (name: string) =>
        lastValueFrom(client.organisationsPOST(new CreateOrganisationRequest({ name }))).then(
          () => resource.reload()
        ),
    };
  })
);
