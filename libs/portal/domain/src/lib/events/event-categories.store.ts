import { computed, inject, resource } from '@angular/core';
import { EventCategoryResponse, EventClient } from '@kultur-hub/shared/api';
import { signalStore, withProps } from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';

export const EventCategoriesStore = signalStore(
  { providedIn: 'root' },
  withProps(() => {
    const client = inject(EventClient);

    const res = resource({
      loader: () => lastValueFrom(client.getEventCategories()),
    });

    return {
      categories: computed<EventCategoryResponse[]>(() => res.value() ?? []),
      loading: res.isLoading,
      hasLoaded: computed<boolean>(() => res.value() !== undefined),
      reload: () => res.reload(),
    };
  })
);
