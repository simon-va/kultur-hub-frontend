import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { EventCategoriesStore, EventsStore } from '@kultur-hub/portal/domain';
import { EventStatus } from '@kultur-hub/shared/api';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'lib-events-detail',
  imports: [DatePipe, ButtonModule, ConfirmDialog, TagModule, DividerModule, TooltipModule],
  templateUrl: './events-detail.html',
  styleUrl: './events-detail.scss',
})
export class EventsDetail {
  protected readonly store = inject(EventsStore);
  protected readonly categoriesStore = inject(EventCategoriesStore);
  protected readonly EventStatus = EventStatus;
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly loading = signal(false);

  protected readonly selectedCategory = computed(() => {
    const event = this.store.selectedEvent();
    if (!event?.eventCategoryId) return null;
    return this.categoriesStore.categories().find((c) => c.id === event.eventCategoryId) ?? null;
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

  protected async updateStatus(status: EventStatus): Promise<void> {
    const ev = this.store.selectedEvent();
    if (!ev || this.loading()) return;
    this.loading.set(true);
    try {
      await this.store.updateEventStatus(ev.id, status);
    } finally {
      this.loading.set(false);
    }
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
      accept: async () => {
        this.loading.set(true);
        try {
          await this.store.deleteEvent(ev.id);
        } finally {
          this.loading.set(false);
        }
      },
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
