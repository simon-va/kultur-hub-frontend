import { computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStore, withProps } from '@ngrx/signals';
import { EMPTY, lastValueFrom } from 'rxjs';
import {
  Client,
  ConversationResponse,
  MessageResponse,
  SendMessageRequest,
} from '@kultur-hub/shared/api';
import { OrganisationsStore } from '../organisations/organisations.store';
import { EventsStore } from './events.store';

export const ConversationStore = signalStore(
  { providedIn: 'root' },
  withProps(() => {
    const client = inject(Client);
    const organisationsStore = inject(OrganisationsStore);
    const eventsStore = inject(EventsStore);

    const resource = rxResource<
      ConversationResponse,
      { orgId: string; eventId: string } | null
    >({
      params: () => {
        const orgId = organisationsStore.selectedOrganisationId();
        const eventId = eventsStore.selectedEventId();
        return orgId && eventId ? { orgId, eventId } : null;
      },
      stream: ({ params }) => {
        if (!params) return EMPTY;
        return client.conversation(params.orgId, params.eventId);
      },
    });

    const _sending = signal(false);
    const _extraMessages = signal<MessageResponse[]>([]);

    effect(() => {
      eventsStore.selectedEventId();
      _extraMessages.set([]);
    }, { allowSignalWrites: true });

    return {
      conversation: computed<ConversationResponse | null>(() => resource.value() ?? null),
      messages: computed<MessageResponse[]>(() => [
        ...(resource.value()?.messages ?? []),
        ..._extraMessages(),
      ]),
      loading: resource.isLoading,
      sending: _sending.asReadonly(),
      sendMessage: async (content: string) => {
        const orgId = organisationsStore.selectedOrganisationId();
        const eventId = eventsStore.selectedEventId();
        if (!orgId || !eventId) return;

        const optimisticId = crypto.randomUUID();
        _extraMessages.update(msgs => [
          ...msgs,
          new MessageResponse({ id: optimisticId, role: 2, content, createdAt: new Date().toISOString() }),
        ]);

        _sending.set(true);
        try {
          const response = await lastValueFrom(
            client.messages(orgId, eventId, new SendMessageRequest({ content }))
          );
          _extraMessages.update(msgs => [
            ...msgs.filter(m => m.id !== optimisticId),
            response.userMessage,
            response.botMessage,
          ]);
        } catch {
          _extraMessages.update(msgs => msgs.filter(m => m.id !== optimisticId));
        } finally {
          _sending.set(false);
        }
      },
    };
  })
);
