import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./giffs/pages/dashboard-page/dashboard-page.component'),
    children: [
      {
        path: 'search',
        loadComponent: () =>
          import('./giffs/pages/search-page/search-page.component'),
      },
      {
        path: 'trending',
        loadComponent: () =>
          import('./giffs/pages/trending-page/trending-page.component'),
      },
      {
        path: 'history/:query', //Url con argumento dinamico
        loadComponent: () => import('./giffs/pages/gif-history/gif-history.component'),
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
