import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  /* ================= AUTH MODULE ================= */
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-routing.module').then(m => m.AUTH_ROUTES)
  },

  /* =============== CANDIDATES MODULE ============== */
  {
    path: 'candidates',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/candidates/candidates-routing.module').then(
        m => m.CANDIDATE_ROUTES
      )
  },

  /* ================= FALLBACK ================= */
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
