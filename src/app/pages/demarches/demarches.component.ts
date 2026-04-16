import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';

interface Demarche {
  title: string;
  description: string;
  icon: string;
  color: string;
  url: string;
}

@Component({
  selector: 'app-demarches',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './demarches.component.html',
  styleUrl: './demarches.component.scss'
})
export class DemarchesComponent {
  demarches: Demarche[] = [
    {
      title: 'État Civil',
      description: 'Acte de naissance, mariage, décès',
      icon: 'article',
      color: '#1565C0',
      url: 'https://www.ville-poissy.fr/index.php/services-en-ligne/etat-civil.html',
    },
    {
      title: 'Carte Nationale d\'Identité',
      description: 'Renouvellement et première demande',
      icon: 'badge',
      color: '#1976D2',
      url: 'https://www.ville-poissy.fr/index.php/services-en-ligne.html',
    },
    {
      title: 'Passeport',
      description: 'Demande ou renouvellement de passeport',
      icon: 'travel_explore',
      color: '#1565C0',
      url: 'https://www.ville-poissy.fr/index.php/services-en-ligne.html',
    },
    {
      title: 'Inscription scolaire',
      description: 'Inscription à l\'école maternelle et primaire',
      icon: 'school',
      color: '#2E7D32',
      url: 'https://www.ville-poissy.fr/index.php/services-en-ligne/inscription-scolaire.html',
    },
    {
      title: 'Listes électorales',
      description: 'S\'inscrire ou modifier sa situation électorale',
      icon: 'how_to_vote',
      color: '#D32F2F',
      url: 'https://www.ville-poissy.fr/index.php/services-en-ligne.html',
    },
    {
      title: 'Permis de construire',
      description: 'Permis de construire ou déclaration préalable',
      icon: 'home_work',
      color: '#E65100',
      url: 'https://www.ville-poissy.fr/index.php/services-en-ligne/urbanisme.html',
    },
    {
      title: 'Logement social',
      description: 'Demande de logement social (numéro unique IDF)',
      icon: 'apartment',
      color: '#7B1FA2',
      url: 'https://www.ville-poissy.fr/index.php/services/logement.html',
    },
    {
      title: 'Aide sociale (CCAS)',
      description: 'RSA, aide au logement, aides CCAS',
      icon: 'support',
      color: '#00695C',
      url: 'https://www.ville-poissy.fr/index.php/services/ccas.html',
    },
    {
      title: 'Prise de rendez-vous',
      description: 'Réserver un créneau avec un agent municipal',
      icon: 'event_available',
      color: '#F57C00',
      url: 'https://www.ville-poissy.fr/index.php/services-en-ligne.html',
    },
    {
      title: 'Signaler un problème',
      description: 'Voirie, éclairage, propreté, dépôt sauvage…',
      icon: 'report_problem',
      color: '#C62828',
      url: 'https://www.ville-poissy.fr/index.php/services-en-ligne.html',
    },
  ];

  constructor(private router: Router) {}

  openDemarche(d: Demarche): void {
    window.open('https://www.ville-poissy.fr/index.php/vos-demarches.html', '_blank');
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
