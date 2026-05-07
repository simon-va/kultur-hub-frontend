import { Routes } from '@angular/router';
import { PortalShell, PortalCreateOrganisationPage } from '@kultur-hub/portal/ui';
import { hasOrganisationGuard } from '@kultur-hub/portal/domain';

export const portalRoutes: Routes = [
  {
    path: '',
    component: PortalShell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [hasOrganisationGuard],
        loadChildren: () =>
          import('@kultur-hub/portal/feature-overview').then(
            (m) => m.portalFeatureOverviewRoutes
          ),
      },
      {
        path: 'setup',
        component: PortalCreateOrganisationPage,
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
