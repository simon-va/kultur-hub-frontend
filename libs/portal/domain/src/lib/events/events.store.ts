import { computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStore, withProps } from '@ngrx/signals';
import { lastValueFrom, of } from 'rxjs';
import { EventClient, EventResponse, EventStatus, UpdateEventStatusRequest } from '@kultur-hub/shared/api';
import { OrganisationsStore } from '../organisations/organisations.store';

export const EventsStore = signalStore(
  { providedIn: 'root' },
  withProps(() => {
    const client = inject(EventClient);
    const organisationsStore = inject(OrganisationsStore);

    const resource = rxResource<EventResponse[], string | null>({
      params: () => organisationsStore.selectedOrganisationId(),
      stream: ({ params: orgId }) => {
        if (!orgId) return of([]);
        return client.getEvents(orgId);
      },
    });

    const _selectedId = signal<string | null>(null);
    const _localUpdates = signal<Map<string, EventResponse>>(new Map());

    effect(() => {
      resource.value();
      _localUpdates.set(new Map());
    }, { allowSignalWrites: true });

    const selectedEventId = computed<string | null>(() => {
      const events = resource.value();
      if (!events || events.length === 0) return null;
      const stored = _selectedId();
      return stored && events.some((e) => e.id === stored) ? stored : null;
    });

    return {
      events: computed<EventResponse[]>(() => {
        const evs = resource.value() ?? [];
        const updates = _localUpdates();
        if (updates.size === 0) return evs;
        return evs.map(e => updates.get(e.id) ?? e);
      }),
      loading: resource.isLoading,
      hasLoaded: computed<boolean>(() => resource.value() !== undefined),
      selectedEventId,
      selectedEvent: computed<EventResponse | null>(() => {
        const id = selectedEventId();
        const updates = _localUpdates();
        const evs = resource.value() ?? [];
        const base = evs.find((e) => e.id === id) ?? null;
        return base ? (updates.get(base.id) ?? base) : null;
      }),
      selectEvent: (id: string) => _selectedId.set(id),
      clearSelection: () => _selectedId.set(null),
      patchEvent: (event: EventResponse) => {
        _localUpdates.update(map => new Map(map).set(event.id, event));
      },
      updateEventStatus: async (eventId: string, status: EventStatus) => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        await lastValueFrom(
          client.updateEventStatus(orgId, eventId, new UpdateEventStatusRequest({ status }))
        );
        resource.reload();
      },
      deleteEvent: async (eventId: string) => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        await lastValueFrom(client.deleteEvent(orgId, eventId));
        _selectedId.set(null);
        resource.reload();
      },
      initializeEvent: async () => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        const created = await lastValueFrom(client.initializeEvent(orgId));
        resource.reload();
        _selectedId.set(created.id);
      },
    };
  })
);
