import { Component } from '@angular/core';
import { EventsSidebar } from '../events-sidebar/events-sidebar';
import { EventsChat } from '../events-chat/events-chat';
import { EventsDetail } from '../events-detail/events-detail';

@Component({
  selector: 'lib-portal-feature-events',
  imports: [EventsSidebar, EventsChat, EventsDetail],
  templateUrl: './portal-feature-events.html',
  styleUrl: './portal-feature-events.scss',
})
export class PortalFeatureEvents {}
