import { computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStore, withProps } from '@ngrx/signals';
import { EMPTY, lastValueFrom } from 'rxjs';
import { Client, EventResponse } from '@kultur-hub/shared/api';
import { OrganisationsStore } from '../organisations/organisations.store';

export const EventsStore = signalStore(
  { providedIn: 'root' },
  withProps(() => {
    const client = inject(Client);
    const organisationsStore = inject(OrganisationsStore);

    const resource = rxResource<EventResponse[], string | null>({
      params: () => organisationsStore.selectedOrganisationId(),
      stream: ({ params: orgId }) => {
        if (!orgId) return EMPTY;
        return client.events(orgId);
      },
    });

    const _selectedId = signal<string | null>(null);

    const selectedEventId = computed<string | null>(() => {
      const events = resource.value();
      if (!events || events.length === 0) return null;
      const stored = _selectedId();
      return stored && events.some((e) => e.id === stored) ? stored : null;
    });

    return {
      events: computed<EventResponse[]>(() => resource.value() ?? []),
      loading: resource.isLoading,
      hasLoaded: computed<boolean>(() => resource.value() !== undefined),
      selectedEventId,
      selectedEvent: computed<EventResponse | null>(() => {
        const id = selectedEventId();
        return (resource.value() ?? []).find((e) => e.id === id) ?? null;
      }),
      selectEvent: (id: string) => _selectedId.set(id),
      clearSelection: () => _selectedId.set(null),
      initializeEvent: async () => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        const created = await lastValueFrom(client.initialize(orgId));
        resource.reload();
        _selectedId.set(created.id);
      },
    };
  })
);
