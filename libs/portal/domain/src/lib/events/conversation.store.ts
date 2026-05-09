import { computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { signalStore, withProps } from '@ngrx/signals';
import { EMPTY, lastValueFrom, of } from 'rxjs';
import {
  EventClient,
  ConversationResponse,
  MessageResponse,
  MessageRole,
  SendMessageRequest,
} from '@kultur-hub/shared/api';
import { OrganisationsStore } from '../organisations/organisations.store';
import { EventsStore } from './events.store';

export const ConversationStore = signalStore(
  { providedIn: 'root' },
  withProps(() => {
    const client = inject(EventClient);
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
        return client.getEventConversation(params.orgId, params.eventId);
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
          new MessageResponse({ id: optimisticId, role: MessageRole.User, content, createdAt: new Date().toISOString() }),
        ]);

        _sending.set(true);
        try {
          const response = await lastValueFrom(
            client.sendEventMessage(orgId, eventId, new SendMessageRequest({ content }))
          );
          if (eventsStore.selectedEventId() === eventId) {
            _extraMessages.update(msgs => [
              ...msgs.filter(m => m.id !== optimisticId),
              response.userMessage,
              response.botMessage,
            ]);
            const updatedEvent = await lastValueFrom(client.getEventById(orgId, eventId));
            eventsStore.patchEvent(updatedEvent);
          }
        } catch {
          if (eventsStore.selectedEventId() === eventId) {
            _extraMessages.update(msgs => msgs.filter(m => m.id !== optimisticId));
          }
        } finally {
          _sending.set(false);
        }
      },
    };
  })
);
