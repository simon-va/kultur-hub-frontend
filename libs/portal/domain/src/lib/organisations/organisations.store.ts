import { computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStore, withProps } from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';
import { Client, CreateOrganisationRequest, OrganisationResponse } from '@kultur-hub/shared/api';
import { UserService } from '@kultur-hub/shared/auth/data-access';

const STORAGE_KEY = 'selectedOrganisationId';

export const OrganisationsStore = signalStore(
  { providedIn: 'root' },
  withProps(() => {
    const client = inject(Client);
    const userService = inject(UserService);
    const resource = rxResource<OrganisationResponse[], string | undefined>({
      params: () => userService.currentUser()?.id,
      stream: () => client.organisationsAll(),
    });

    const _selectedId = signal<string | null>(localStorage.getItem(STORAGE_KEY));

    const selectedOrganisationId = computed<string | null>(() => {
      const orgs = resource.value();
      if (!orgs || orgs.length === 0) return null;
      const stored = _selectedId();
      if (stored && orgs.some((o) => o.id === stored)) return stored;
      return orgs[0].id;
    });

    return {
      organisations: computed<OrganisationResponse[]>(() => resource.value() ?? []),
      loading: resource.isLoading,
      hasLoaded: computed<boolean>(() => resource.value() !== undefined),
      selectedOrganisationId,
      selectedOrganisation: computed<OrganisationResponse | null>(() => {
        const orgs = resource.value() ?? [];
        const id = selectedOrganisationId();
        return orgs.find((o) => o.id === id) ?? null;
      }),
      selectOrganisation: (id: string) => {
        _selectedId.set(id);
        localStorage.setItem(STORAGE_KEY, id);
      },
      clearSelection: () => {
        _selectedId.set(null);
        localStorage.removeItem(STORAGE_KEY);
      },
      createOrganisation: async (name: string) => {
        const created = await lastValueFrom(
          client.organisationsPOST(new CreateOrganisationRequest({ name }))
        );
        _selectedId.set(created.id);
        localStorage.setItem(STORAGE_KEY, created.id);
        resource.reload();
      },
    };
  })
);
