import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/landing-page/landing-page.component').then(m => m.LandingPageComponent) },
  { path: 'faq', loadComponent: () => import('./components/faq/faq.component').then(m => m.FAQComponent), data: { title: 'FAQ - DisposaMail' } },
  { path: '**', redirectTo: '' }
];
