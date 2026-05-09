import { computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStore, withProps } from '@ngrx/signals';
import { EMPTY, lastValueFrom, of } from 'rxjs';
import { EventClient, EventOverviewResponse, EventResponse, EventStatus, UpdateEventStatusRequest, CreatedResponse } from '@kultur-hub/shared/api';
import { OrganisationsStore } from '../organisations/organisations.store';

export const EventsStore = signalStore(
  { providedIn: 'root' },
  withProps(() => {
    const client = inject(EventClient);
    const organisationsStore = inject(OrganisationsStore);

    const overviewResource = rxResource<EventOverviewResponse[], string | null>({
      params: () => organisationsStore.selectedOrganisationId(),
      stream: ({ params: orgId }) => {
        if (!orgId) return of([]);
        return client.getEventsOverview(orgId);
      },
    });

    const _selectedId = signal<string | null>(null);

    const detailResource = rxResource<EventResponse, { orgId: string; eventId: string } | null>({
      params: () => {
        const orgId = organisationsStore.selectedOrganisationId();
        const eventId = _selectedId();
        return orgId && eventId ? { orgId, eventId } : null;
      },
      stream: ({ params }) => {
        if (!params) return EMPTY;
        return client.getEventById(params.orgId, params.eventId);
      },
    });

    effect(() => {
      organisationsStore.selectedOrganisationId();
      _selectedId.set(null);
    }, { allowSignalWrites: true });

    const _overviewLoadedForOrg = signal<string | null>(null);

    effect(() => {
      const orgId = organisationsStore.selectedOrganisationId();
      const loading = overviewResource.isLoading();
      const value = overviewResource.value();
      if (!loading && value !== undefined && orgId) {
        _overviewLoadedForOrg.set(orgId);
      }
    }, { allowSignalWrites: true });

    const overviewEvents = computed<EventOverviewResponse[]>(() => overviewResource.value() ?? []);

    return {
      overviewEvents,
      overviewLoading: overviewResource.isLoading,
      overviewHasLoaded: computed<boolean>(() => overviewResource.value() !== undefined),
      overviewHasLoadedForCurrentOrg: computed<boolean>(() => _overviewLoadedForOrg() === organisationsStore.selectedOrganisationId()),
      selectedEventId: _selectedId.asReadonly(),
      selectedEvent: computed<EventResponse | null>(() => detailResource.value() ?? null),
      eventLoading: detailResource.isLoading,
      eventHasLoaded: computed<boolean>(() => detailResource.value() !== undefined),
      selectEvent: (id: string) => _selectedId.set(id),
      clearSelection: () => _selectedId.set(null),
      reloadSelectedEvent: () => detailResource.reload(),
      updateEventStatus: async (eventId: string, status: EventStatus) => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        await lastValueFrom(
          client.updateEventStatus(orgId, eventId, new UpdateEventStatusRequest({ status }))
        );
        detailResource.reload();
      },
      deleteEvent: async (eventId: string) => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        await lastValueFrom(client.deleteEvent(orgId, eventId));
        _selectedId.set(null);
        overviewResource.reload();
      },
      initializeEvent: async () => {
        const orgId = organisationsStore.selectedOrganisationId();
        if (!orgId) return;
        const created = await lastValueFrom(client.initializeEvent(orgId));
        overviewResource.reload();
        _selectedId.set(created.id);
      },
    };
  })
);
