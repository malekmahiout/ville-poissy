import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { Association } from '../associations/associations.component';

@Component({
  selector: 'app-association-detail',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgIf],
  templateUrl: './association-detail.component.html',
  styleUrl: './association-detail.component.scss',
})
export class AssociationDetailComponent {
  asso: Association | null = null;

  constructor(private router: Router) {
    const state = window.history.state as any;
    this.asso = state?.asso || null;
    if (!this.asso) this.router.navigate(['/associations']);
  }

  appeler(): void { if (this.asso?.telephone) window.open(`tel:${this.asso.telephone}`); }
  ouvrirEmail(): void { if (this.asso?.email) window.open(`mailto:${this.asso.email}`); }
  ouvrirSite(): void { if (this.asso?.site) window.open('https://' + this.asso.site, '_blank'); }
  ouvrirAnnuaire(): void { window.open('https://ville-poissy.fr/index.php/votre-mairie/en-kiosque/4050-guide-des-associations-2024.html?jscheck=1', '_blank'); }

  ouvrirMaps(): void {
    if (!this.asso) return;
    const q = encodeURIComponent(`${this.asso.adresse}, ${this.asso.codePostal} Poissy`);
    window.open(`https://maps.google.com/?q=${q}`, '_blank');
  }

  goBack(): void { this.router.navigate(['/associations']); }
}
