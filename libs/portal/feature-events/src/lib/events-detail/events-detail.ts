import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventsStore } from '@kultur-hub/portal/domain';
import { EventStatus } from '@kultur-hub/shared/api';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-events-detail',
  imports: [DatePipe, ButtonModule, ConfirmDialog, TagModule, DividerModule, TooltipModule],
  templateUrl: './events-detail.html',
  styleUrl: './events-detail.scss',
})
export class EventsDetail {
  protected readonly store = inject(EventsStore);
  protected readonly EventStatus = EventStatus;
  private readonly confirmationService = inject(ConfirmationService);

  protected statusLabel(status: EventStatus): string {
    switch (status) {
      case EventStatus.Draft: return 'Entwurf';
      case EventStatus.Published: return 'Veröffentlicht';
      case EventStatus.Failed: return 'Fehlgeschlagen';
      case EventStatus.ReadyToPublish: return 'Bereit';
      default: return '';
    }
  }

  protected updateStatus(status: EventStatus): void {
    const ev = this.store.selectedEvent();
    if (!ev) return;
    this.store.updateEventStatus(ev.id, status);
  }

  protected deleteEvent(): void {
    const ev = this.store.selectedEvent();
    if (!ev) return;
    this.confirmationService.confirm({
      message: `Soll die Veranstaltung "${ev.title || 'Neue Veranstaltung'}" wirklich gelöscht werden?`,
      header: 'Veranstaltung löschen',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Löschen',
      rejectLabel: 'Abbrechen',
      accept: () => this.store.deleteEvent(ev.id),
    });
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
