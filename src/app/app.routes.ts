import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'signalements',
    loadComponent: () => import('./pages/signalements/signalement-list.component').then(m => m.SignalementListComponent),
  },
  {
    path: 'signalements/nouveau',
    loadComponent: () => import('./pages/signalements/signalement-create.component').then(m => m.SignalementCreateComponent),
  },
  {
    path: 'securite',
    loadComponent: () => import('./pages/securite/securite.component').then(m => m.SecuriteComponent),
  },
  {
    path: 'agenda',
    loadComponent: () => import('./pages/agenda/agenda.component').then(m => m.AgendaComponent),
  },
  {
    path: 'demarches',
    loadComponent: () => import('./pages/demarches/demarches.component').then(m => m.DemarchesComponent),
  },
  {
    path: 'mobilite',
    loadComponent: () => import('./pages/mobilite/mobilite.component').then(m => m.MobiliteComponent),
  },
  {
    path: 'meteo',
    loadComponent: () => import('./pages/meteo/meteo.component').then(m => m.MeteoComponent),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent),
  },
  {
    path: 'numeros-utiles',
    loadComponent: () => import('./pages/numeros-utiles/numeros-utiles.component').then(m => m.NumerosUtilesComponent),
  },
  {
    path: 'accessibilite',
    loadComponent: () => import('./pages/accessibilite/accessibilite.component').then(m => m.AccessibiliteComponent),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
  },
  {
    path: 'poissy-ai',
    loadComponent: () => import('./pages/poissy-ai/poissy-ai.component').then(m => m.PoissynAiComponent),
  },
  {
    path: 'actualites',
    loadComponent: () => import('./pages/actualites/actualites.component').then(m => m.ActualitesComponent),
  },
  {
    path: 'actualite-detail',
    loadComponent: () => import('./pages/actualite-detail/actualite-detail.component').then(m => m.ActualiteDetailComponent),
  },
  {
    path: 'agenda-detail',
    loadComponent: () => import('./pages/agenda-detail/agenda-detail.component').then(m => m.AgendaDetailComponent),
  },
  {
    path: 'commerce',
    loadComponent: () => import('./pages/commerce/commerce.component').then(m => m.CommerceComponent),
  },
  {
    path: 'artisans',
    loadComponent: () => import('./pages/artisan/artisan.component').then(m => m.ArtisanComponent),
  },
  {
    path: 'commerce-detail',
    loadComponent: () => import('./pages/commerce-detail/commerce-detail.component').then(m => m.CommerceDetailComponent),
  },
  {
    path: 'decouvrir',
    loadComponent: () => import('./pages/decouvrir/decouvrir.component').then(m => m.DecouvrirComponent),
  },
  {
    path: 'associations',
    loadComponent: () => import('./pages/associations/associations.component').then(m => m.AssociationsComponent),
  },
  {
    path: 'association-detail',
    loadComponent: () => import('./pages/association-detail/association-detail.component').then(m => m.AssociationDetailComponent),
  },
  { path: '**', redirectTo: 'home' },
];
