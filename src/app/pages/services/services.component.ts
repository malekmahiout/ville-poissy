import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, CurrencyPipe, DecimalPipe } from '@angular/common';

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  phone?: string;
  horaires?: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, MatSliderModule, FormsModule, NgFor, NgIf, CurrencyPipe, DecimalPipe],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  activeTab: 'famille' | 'sport' | 'calculateur' = 'famille';

  familleServices: ServiceItem[] = [
    { title: 'Crèche municipale Les Petits Pois', description: 'Accueil des enfants de 0 à 3 ans', icon: 'child_care', color: '#E91E63', phone: '01 39 22 31 70', horaires: 'Lun-Ven 7h30-18h30' },
    { title: 'Halte-garderie du Martinet', description: 'Accueil occasionnel 0-6 ans', icon: 'baby_changing_station', color: '#9C27B0', phone: '01 39 22 31 72', horaires: 'Lun-Ven 8h00-18h00' },
    { title: 'ALSH – Centre de loisirs', description: 'Mercredis et vacances scolaires', icon: 'toys', color: '#FF9800', phone: '01 39 22 31 75', horaires: 'Mercredis 7h30-18h30' },
    { title: 'CCAS Poissy', description: 'Aide sociale, seniors, handicap', icon: 'support', color: '#00695C', phone: '01 39 22 31 80', horaires: 'Lun-Ven 9h00-12h00, 13h30-17h00' },
    { title: 'PMI – Protection Maternelle', description: 'Suivi médical mère et enfant (0-6 ans)', icon: 'pregnant_woman', color: '#1565C0', phone: '01 39 22 31 85', horaires: 'Mar et Jeu 9h00-12h00' },
    { title: 'Maison des Adolescents', description: 'Espace d\'écoute et d\'accompagnement pour 12-25 ans', icon: 'group', color: '#7B1FA2', phone: '01 39 22 31 90', horaires: 'Lun-Sam 14h00-19h00' },
  ];

  sportServices: ServiceItem[] = [
    { title: 'Piscine municipale', description: 'Bassin 25m, pataugeoire, cours de natation', icon: 'pool', color: '#1565C0', horaires: 'Lun-Dim 7h00-21h00' },
    { title: 'Gymnase Roland Garros', description: 'Basketball, volleyball, activités multisports', icon: 'sports_basketball', color: '#E65100', horaires: 'Lun-Sam 8h00-22h00' },
    { title: 'Stade Municipal', description: 'Football, athlétisme, vestiaires', icon: 'sports_soccer', color: '#2E7D32', horaires: 'Lun-Dim 8h00-20h00' },
    { title: 'Salle de tennis', description: '4 courts couverts, cours de tennis tous niveaux', icon: 'sports_tennis', color: '#FFC107', horaires: 'Lun-Dim 8h00-22h00' },
    { title: 'Médiathèque', description: 'Livres, DVD, jeux vidéo, accès internet', icon: 'local_library', color: '#7B1FA2', horaires: 'Mar-Sam 10h00-18h30' },
    { title: 'Cinéma Rex', description: 'Cinéma municipal, tarifs réduits pour Poissyards', icon: 'theaters', color: '#37474F', horaires: 'Mer, Sam, Dim' },
  ];

  // Calculateur quotient familial
  revenuMensuel = 2500;
  nombrePersonnes = 3;
  nombreEnfants = 1;

  get quotientFamilial(): number {
    const base = (this.revenuMensuel * 12) / (this.nombrePersonnes + this.nombreEnfants * 0.5);
    return Math.round(base / 12);
  }

  get tarif(): string {
    const qf = this.quotientFamilial;
    if (qf < 300) return 'Gratuit';
    if (qf < 600) return `${(qf * 0.008).toFixed(2)} €/h`;
    if (qf < 1000) return `${(qf * 0.012).toFixed(2)} €/h`;
    return `${(qf * 0.018).toFixed(2)} €/h`;
  }

  get tranche(): string {
    const qf = this.quotientFamilial;
    if (qf < 300) return 'Tranche 1 – Très modeste';
    if (qf < 600) return 'Tranche 2 – Modeste';
    if (qf < 1000) return 'Tranche 3 – Intermédiaire';
    return 'Tranche 4 – Aisé';
  }

  constructor(private router: Router) {}

  call(phone: string): void {
    window.open(`tel:${phone}`);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
