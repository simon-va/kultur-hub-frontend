import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventsStore } from '@kultur-hub/portal/domain';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';

type FilterValue = 'all' | 'draft' | 'published';

@Component({
  selector: 'lib-events-sidebar',
  imports: [FormsModule, DatePipe, ButtonModule, SelectButtonModule, TagModule],
  templateUrl: './events-sidebar.html',
  styleUrl: './events-sidebar.scss',
})
export class EventsSidebar {
  protected readonly store = inject(EventsStore);

  protected readonly filterOptions: { label: string; value: FilterValue }[] = [
    { label: 'Alle', value: 'all' },
    { label: 'Entwurf', value: 'draft' },
    { label: 'Veröffentlicht', value: 'published' },
  ];

  protected readonly filterValue = signal<FilterValue>('all');

  protected readonly filteredEvents = computed(() => {
    const f = this.filterValue();
    const events = this.store.events();
    if (f === 'all') return events;
    const status = f === 'draft' ? 0 : 1;
    return events.filter((e) => e.status === status);
  });

  protected statusLabel(status: number): string {
    switch (status) {
      case 0: return 'Entwurf';
      case 1: return 'Veröffentlicht';
      case 2: return 'Fehlgeschlagen';
      case 3: return 'Bereit';
      default: return '';
    }
  }

  protected statusSeverity(status: number): 'secondary' | 'success' | 'danger' | 'warn' {
    switch (status) {
      case 0: return 'secondary';
      case 1: return 'success';
      case 2: return 'danger';
      case 3: return 'warn';
      default: return 'secondary';
    }
  }
}
