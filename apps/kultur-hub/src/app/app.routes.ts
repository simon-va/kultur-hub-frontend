import { Routes } from '@angular/router';
import { authGuard, adminGuard, notAuthenticatedGuard } from '@kultur-hub/shared/auth/data-access';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [notAuthenticatedGuard],
    loadComponent: () =>
      import('@kultur-hub/shared/auth/feature-login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    canActivate: [notAuthenticatedGuard],
    loadComponent: () =>
      import('@kultur-hub/portal/feature-register').then((m) => m.RegisterPage),
  },
  {
    path: 'portal',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./portal/portal.routes').then((m) => m.portalRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: '',
    loadChildren: () =>
      import('./public/public.routes').then((m) => m.publicRoutes),
  },
  { path: '**', redirectTo: '' },
];
