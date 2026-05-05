import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    // TODO: add admin shell/layout component
    children: [
      { path: '', redirectTo: 'invitations', pathMatch: 'full' },
      {
        path: 'invitations',
        loadChildren: () =>
          import('@kultur-hub/admin/feature-invitations').then(
            (m) => m.adminFeatureInvitationsRoutes
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('@kultur-hub/admin/feature-users').then((m) => m.adminFeatureUsersRoutes),
      },
      {
        path: 'organizations',
        loadChildren: () =>
          import('@kultur-hub/admin/feature-organizations').then(
            (m) => m.adminFeatureOrganizationsRoutes
          ),
      },
    ],
  },
];
