import { Routes } from '@angular/router';
import { PublicShell } from '@kultur-hub/public/ui';

export const publicRoutes: Routes = [
  {
    path: '',
    component: PublicShell,
    children: [
      { path: '', redirectTo: 'willkommen', pathMatch: 'full' },
      {
        path: 'willkommen',
        loadChildren: () =>
          import('@kultur-hub/public/feature-welcome').then(
            (m) => m.publicFeatureWelcomeRoutes,
          ),
      },
      {
        path: 'kulturkalender',
        loadChildren: () =>
          import('@kultur-hub/public/feature-events').then(
            (m) => m.publicFeatureEventsRoutes,
          ),
      },
      {
        path: 'berichte',
        loadChildren: () =>
          import('@kultur-hub/public/feature-reports').then(
            (m) => m.publicFeatureReportsRoutes,
          ),
      },
      {
        path: 'mach-mit',
        loadChildren: () =>
          import('@kultur-hub/public/feature-participate').then(
            (m) => m.publicFeatureParticipateRoutes,
          ),
      },
      {
        path: 'kulturschaffende',
        loadChildren: () =>
          import('@kultur-hub/public/feature-clubs').then(
            (m) => m.publicFeatureClubsRoutes,
          ),
      },
    ],
  },
];
