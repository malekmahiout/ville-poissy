import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgClass, NgIf } from '@angular/common';

interface AccessibiliteService {
  title: string;
  description: string;
  icon: string;
  color: string;
  phone?: string;
}

@Component({
  selector: 'app-accessibilite',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgClass, NgIf],
  templateUrl: './accessibilite.component.html',
  styleUrl: './accessibilite.component.scss'
})
export class AccessibiliteComponent {
  fontSize = 1;

  services: AccessibiliteService[] = [
    { title: 'Transport PMR (Proxim\'City)', description: 'Transport adapté à la demande pour les personnes à mobilité réduite. Réservation 48h à l\'avance.', icon: 'accessible_forward', color: '#006064', phone: '01 39 22 42 00' },
    { title: 'Aide à domicile (CCAS)', description: 'Service d\'aide ménagère, portage de repas, accompagnement pour les personnes âgées ou handicapées.', icon: 'home', color: '#00695C', phone: '01 39 22 31 80' },
    { title: 'Ergothérapeute municipal', description: 'Conseil pour l\'adaptation du logement aux personnes à mobilité réduite.', icon: 'handyman', color: '#1565C0', phone: '01 39 22 31 82' },
    { title: 'Allocution Adulte Handicapé', description: 'Renseignements sur l\'AAH, RQTH et droits des personnes handicapées.', icon: 'health_and_safety', color: '#7B1FA2', phone: '01 39 22 31 83' },
    { title: 'Plan autisme – Personne perdue', description: 'Protocole municipal pour la recherche d\'une personne autiste disparue.', icon: 'person_search', color: '#E65100', phone: '01 39 22 31 60' },
    { title: 'Audiodescription lieux publics', description: 'Visites guidées en audiodescription pour les personnes malvoyantes.', icon: 'hearing', color: '#AD1457', phone: '01 39 22 31 84' },
  ];

  accessibilitePoints = [
    { lieu: 'Mairie principale', PMR: true, boucle: true, braille: false },
    { lieu: 'Médiathèque', PMR: true, boucle: true, braille: true },
    { lieu: 'Piscine municipale', PMR: true, boucle: false, braille: false },
    { lieu: 'Salle polyvalente', PMR: true, boucle: true, braille: false },
    { lieu: 'CCAS', PMR: true, boucle: false, braille: false },
  ];

  constructor(private router: Router) {}

  increaseFontSize(): void {
    if (this.fontSize < 1.5) {
      this.fontSize = Math.min(1.5, this.fontSize + 0.1);
      document.documentElement.style.fontSize = `${this.fontSize}rem`;
    }
  }

  decreaseFontSize(): void {
    if (this.fontSize > 0.8) {
      this.fontSize = Math.max(0.8, this.fontSize - 0.1);
      document.documentElement.style.fontSize = `${this.fontSize}rem`;
    }
  }

  resetFontSize(): void {
    this.fontSize = 1;
    document.documentElement.style.fontSize = '1rem';
  }

  call(phone: string): void {
    window.open(`tel:${phone}`);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
