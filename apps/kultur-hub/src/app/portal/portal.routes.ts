import { Routes } from '@angular/router';

export const portalRoutes: Routes = [
  {
    path: '',
    // TODO: add portal shell/layout component
    children: [
      { path: '', redirectTo: 'organizations', pathMatch: 'full' },
      {
        path: 'organizations',
        loadChildren: () =>
          import('@kultur-hub/portal/feature-organizations').then(
            (m) => m.portalFeatureOrganizationsRoutes
          ),
      },
    ],
  },
];
