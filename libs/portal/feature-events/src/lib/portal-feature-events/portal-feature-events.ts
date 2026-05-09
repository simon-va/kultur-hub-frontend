import { Component, inject } from '@angular/core';
import { EventsStore } from '@kultur-hub/portal/domain';
import { EventsSidebar } from '../events-sidebar/events-sidebar';
import { EventsChat } from '../events-chat/events-chat';
import { EventsDetail } from '../events-detail/events-detail';

@Component({
  selector: 'lib-portal-feature-events',
  imports: [EventsSidebar, EventsChat, EventsDetail],
  templateUrl: './portal-feature-events.html',
  styleUrl: './portal-feature-events.scss',
})
export class PortalFeatureEvents {
  protected readonly eventsStore = inject(EventsStore);
}
