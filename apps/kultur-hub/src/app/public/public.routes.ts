import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: '',
    // TODO: add public shell/layout component
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      {
        path: 'events',
        loadChildren: () =>
          import('@kultur-hub/public/feature-events').then((m) => m.publicFeatureEventsRoutes),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('@kultur-hub/public/feature-reports').then((m) => m.publicFeatureReportsRoutes),
      },
      {
        path: 'clubs',
        loadChildren: () =>
          import('@kultur-hub/public/feature-clubs').then((m) => m.publicFeatureClubsRoutes),
      },
    ],
  },
];
