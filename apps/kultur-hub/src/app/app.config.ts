import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const KulturHubPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#f0f9f1',
      100: '#dcf1de',
      200: '#bbe3be',
      300: '#8cce90',
      400: '#5db362',
      500: '#48a14c',
      600: '#368040',
      700: '#2d6636',
      800: '#27522e',
      900: '#224427',
      950: '#0f2514',
    },
  },
});
import { authInterceptor, SUPABASE_URL, SUPABASE_ANON_KEY } from '@kultur-hub/shared/auth/data-access';
import { ConfirmationService } from 'primeng/api';
import { API_BASE_URL, EventClient, OrganisationClient, UserClient } from '@kultur-hub/shared/api';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: KulturHubPreset,
        options: { darkModeSelector: false || 'none' },
      },
    }),
    { provide: SUPABASE_URL, useValue: environment.supabaseUrl },
    { provide: SUPABASE_ANON_KEY, useValue: environment.supabaseAnonKey },
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    ConfirmationService,
    EventClient,
    OrganisationClient,
    UserClient,
  ],
};
