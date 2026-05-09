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
    const _deletedIds = signal<Set<string>>(new Set());
    const _newEvents = signal<EventResponse[]>([]);

    effect(() => {
      resource.value();
      _localUpdates.set(new Map());
      _deletedIds.set(new Set());
      _newEvents.set([]);
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
        const deleted = _deletedIds();
        const added = _newEvents();
        const merged = evs
          .map(e => updates.get(e.id) ?? e)
          .filter(e => !deleted.has(e.id));
        for (const a of added) {
          if (!deleted.has(a.id) && !merged.some(e => e.id === a.id)) {
            merged.push(a);
          }
        }
        return merged;
      }),
      loading: resource.isLoading,
      hasLoaded: computed<boolean>(() => resource.value() !== undefined),
      selectedEventId,
      selectedEvent: computed<EventResponse | null>(() => {
        const id = selectedEventId();
        const updates = _localUpdates();
        const deleted = _deletedIds();
        const evs = resource.value() ?? [];
        const base = evs.find((e) => e.id === id) ?? null;
        if (base && deleted.has(base.id)) return null;
        return base ? (updates.get(base.id) ?? base) : null;
      }),
      selectEvent: (id: string) => _selectedId.set(id),
      clearSelection: () => _selectedId.set(null),
      patchEvent: (event: EventResponse) => {
        _localUpdates.update(map => new Map(map).set(event.id, event));
        _deletedIds.update(set => {
          const newSet = new Set(set);
          newSet.delete(event.id);
          return newSet;
        });
      },
      updateEventStatus: async (eventId: string, status: EventStatus) => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        await lastValueFrom(
          client.updateEventStatus(orgId, eventId, new UpdateEventStatusRequest({ status }))
        );
        const updated = await lastValueFrom(client.getEventById(orgId, eventId));
        _localUpdates.update(map => new Map(map).set(updated.id, updated));
      },
      deleteEvent: async (eventId: string) => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        await lastValueFrom(client.deleteEvent(orgId, eventId));
        _selectedId.set(null);
        _deletedIds.update(set => new Set(set).add(eventId));
      },
      initializeEvent: async () => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        const created = await lastValueFrom(client.initializeEvent(orgId));
        const fullEvent = await lastValueFrom(client.getEventById(orgId, created.id));
        _newEvents.update(events => [...events, fullEvent]);
        _selectedId.set(created.id);
      },
    };
  })
);
