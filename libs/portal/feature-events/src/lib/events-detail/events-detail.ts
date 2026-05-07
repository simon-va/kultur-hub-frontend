import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventsStore } from '@kultur-hub/portal/domain';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'lib-events-detail',
  imports: [DatePipe, ButtonModule, TagModule, DividerModule],
  templateUrl: './events-detail.html',
  styleUrl: './events-detail.scss',
})
export class EventsDetail {
  protected readonly store = inject(EventsStore);

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
