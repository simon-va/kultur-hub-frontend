import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventCategoriesStore, EventsStore } from '@kultur-hub/portal/domain';
import { EventStatus } from '@kultur-hub/shared/api';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';

type FilterValue = 'all' | 'unpublished' | 'published';

@Component({
  selector: 'lib-events-sidebar',
  imports: [FormsModule, DatePipe, ButtonModule, SelectButtonModule, TagModule],
  templateUrl: './events-sidebar.html',
  styleUrl: './events-sidebar.scss',
})
export class EventsSidebar {
  protected readonly store = inject(EventsStore);
  private readonly _categoriesStore = inject(EventCategoriesStore);
  protected readonly EventStatus = EventStatus;

  protected readonly filterOptions: { label: string; value: FilterValue }[] = [
    { label: 'Alle', value: 'all' },
    { label: 'Unveröffentlicht', value: 'unpublished' },
    { label: 'Veröffentlicht', value: 'published' },
  ];

  protected readonly filterValue = signal<FilterValue>('all');

  protected readonly filteredEvents = computed(() => {
    const f = this.filterValue();
    const events = this.store.overviewEvents();
    if (f === 'all') return events;
    if (f === 'unpublished') {
      return events.filter(
        (e) => e.status === EventStatus.Draft || e.status === EventStatus.ReadyToPublish
      );
    }
    return events.filter((e) => e.status === EventStatus.Published);
  });

  protected statusLabel(status: EventStatus): string {
    switch (status) {
      case EventStatus.Draft: return 'Entwurf';
      case EventStatus.Published: return 'Veröffentlicht';
      case EventStatus.Failed: return 'Fehlgeschlagen';
      case EventStatus.ReadyToPublish: return 'Bereit';
      default: return '';
    }
  }

  protected statusSeverity(status: EventStatus): 'secondary' | 'success' | 'danger' | 'warn' {
    switch (status) {
      case EventStatus.Draft: return 'secondary';
      case EventStatus.Published: return 'success';
      case EventStatus.Failed: return 'danger';
      case EventStatus.ReadyToPublish: return 'warn';
      default: return 'secondary';
    }
  }
}
