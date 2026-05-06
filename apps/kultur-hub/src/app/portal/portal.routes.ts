import { Routes } from '@angular/router';
import { PortalShell } from '@kultur-hub/portal/ui';

export const portalRoutes: Routes = [
  {
    path: '',
    component: PortalShell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('@kultur-hub/portal/feature-overview').then(
            (m) => m.portalFeatureOverviewRoutes
          ),
      },
      {
        path: 'organizations',
        loadChildren: () =>
          import('@kultur-hub/portal/feature-organizations').then(
            (m) => m.portalFeatureOrganizationsRoutes
          ),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('@kultur-hub/portal/feature-events').then(
            (m) => m.portalFeatureEventsRoutes
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('@kultur-hub/portal/feature-reports').then(
            (m) => m.portalFeatureReportsRoutes
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('@kultur-hub/portal/feature-profile').then(
            (m) => m.portalFeatureProfileRoutes
          ),
      },
    ],
  },
];
