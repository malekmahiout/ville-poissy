import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NumeroUtile {
  service: string;
  numero: string;
  horaires: string;
  icon: string;
  color: string;
  category: string;
  adresse?: string;
}

@Component({
  selector: 'app-numeros-utiles',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf, FormsModule],
  templateUrl: './numeros-utiles.component.html',
  styleUrl: './numeros-utiles.component.scss'
})
export class NumerosUtilesComponent {
  searchQuery = '';
  activeFilter = 'Tous';

  categories = ['Tous', 'Mairie', 'Santé', 'Urgences', 'Justice', 'Emploi', 'Transports', 'Social'];

  allNumeros: NumeroUtile[] = [
    // ── MAIRIE ──
    { service: 'Mairie de Poissy — Standard', numero: '01 39 22 56 40', horaires: 'Lun 8h30-16h · Mar-Ven 8h30-18h · Sam 9h-12h30', icon: 'account_balance', color: '#1565C0', category: 'Mairie', adresse: 'Place de la République, 78300' },
    { service: 'État civil (CNI, passeport, actes)', numero: '01 39 22 56 40', horaires: 'Sans interruption pendant ouverture', icon: 'article', color: '#1565C0', category: 'Mairie' },
    { service: 'Police Municipale', numero: '01 39 22 31 15', horaires: 'Lun-Sam 9h-18h', icon: 'local_police', color: '#1565C0', category: 'Mairie', adresse: '20 rue Jean-Claude-Mary' },
    { service: 'Service Technique', numero: '01 39 22 31 40', horaires: 'Lun-Ven 8h-17h', icon: 'build', color: '#1565C0', category: 'Mairie' },
    { service: 'Médiathèque de Poissy', numero: '01 39 22 56 34', horaires: 'Mar 14h-18h · Mer 9h-18h30 · Jeu-Ven 14h-18h · Sam 9h-18h', icon: 'local_library', color: '#1565C0', category: 'Mairie', adresse: 'Place Zola' },
    { service: 'École Municipale de Musique', numero: '01 39 22 36 49', horaires: 'Lun-Ven 9h30-19h', icon: 'music_note', color: '#1565C0', category: 'Mairie', adresse: '142 rue Louis-Armand' },
    // ── URGENCES ──
    { service: 'SAMU', numero: '15', horaires: '24h/24', icon: 'emergency', color: '#C62828', category: 'Urgences' },
    { service: 'Police Nationale', numero: '17', horaires: '24h/24', icon: 'security', color: '#0D47A1', category: 'Urgences' },
    { service: 'Pompiers (SDIS 78)', numero: '18', horaires: '24h/24', icon: 'local_fire_department', color: '#E53935', category: 'Urgences' },
    { service: 'Urgences Européen', numero: '112', horaires: '24h/24', icon: 'sos', color: '#B71C1C', category: 'Urgences' },
    { service: 'Commissariat Police Nationale', numero: '01 39 22 27 27', horaires: '24h/24', icon: 'local_police', color: '#0D47A1', category: 'Urgences', adresse: '16 Bd Louis-Lemelle' },
    { service: 'Anti-poison (CAPTV)', numero: '01 40 05 48 48', horaires: '24h/24', icon: 'warning', color: '#F57C00', category: 'Urgences' },
    // ── SANTÉ ──
    { service: 'CHI Poissy-Saint-Germain', numero: '01 39 27 40 00', horaires: '24h/24 — Urgences, maternité, consultations', icon: 'local_hospital', color: '#C62828', category: 'Santé', adresse: 'Rue du Champ Gaillard' },
    { service: 'Clinique Saint-Louis', numero: '01 39 65 19 97', horaires: 'Lun-Ven 7h-19h · Sam 8h-19h', icon: 'healing', color: '#D32F2F', category: 'Santé', adresse: '1 rue Basset' },
    { service: 'CPAM des Yvelines (Ameli)', numero: '3646', horaires: 'Sur RDV', icon: 'health_and_safety', color: '#00796B', category: 'Santé', adresse: '1 place Duployé' },
    { service: 'Pharmacie de garde', numero: '3237', horaires: '24h/24 — Info pharmacie de garde', icon: 'medication', color: '#2E7D32', category: 'Santé' },
    // ── JUSTICE ──
    { service: 'Tribunal d\'Instance de Poissy', numero: '01 39 65 40 40', horaires: 'Lun-Ven 9h-12h / 14h-17h', icon: 'gavel', color: '#37474F', category: 'Justice', adresse: '89 avenue Maurice Berteaux' },
    { service: 'Conseil de Prud\'hommes', numero: '01 39 22 31 40', horaires: 'Lun-Ven 9h-12h / 14h-17h', icon: 'balance', color: '#455A64', category: 'Justice', adresse: '91 avenue Maurice Berteaux' },
    { service: 'CIDFF 78 – Droits des Femmes', numero: '01 30 74 21 01', horaires: 'Lun-Ven 9h-17h', icon: 'support_agent', color: '#880E4F', category: 'Justice', adresse: '52 bis rue Joseph-Kessel' },
    // ── EMPLOI ──
    { service: 'France Travail (ex-Pôle Emploi)', numero: '3949', horaires: 'Lun-Ven 9h-17h', icon: 'work', color: '#7B1FA2', category: 'Emploi' },
    { service: 'Mission Locale Intercommunale', numero: '01 30 65 43 40', horaires: 'Lun-Ven 9h-17h', icon: 'school', color: '#4A148C', category: 'Emploi', adresse: '19 boulevard Devaux' },
    { service: 'SIP Poissy (Impôts)', numero: '0 809 401 401', horaires: 'Lun-Ven 8h30-19h', icon: 'receipt_long', color: '#37474F', category: 'Emploi', adresse: '6 rue Saint-Barthélémy' },
    { service: 'CIO – Orientation scolaire', numero: '01 39 65 20 48', horaires: 'Lun-Ven 9h-17h', icon: 'school', color: '#1565C0', category: 'Emploi', adresse: '23 rue du 11-Novembre-1918' },
    // ── TRANSPORTS ──
    { service: 'SNCF Info / Gare de Poissy', numero: '36 35', horaires: '7h-22h', icon: 'train', color: '#E53935', category: 'Transports' },
    { service: 'Transdev – Bus (info ligne)', numero: '0800 26 26 26', horaires: 'Lun-Sam 7h-20h', icon: 'directions_bus', color: '#FF6F00', category: 'Transports' },
    { service: 'Fourrière municipale', numero: '01 39 22 31 65', horaires: 'Lun-Ven 9h-17h', icon: 'directions_car', color: '#455A64', category: 'Transports' },
    // ── SOCIAL ──
    { service: 'CCAS Poissy', numero: '01 39 22 31 80', horaires: 'Lun-Ven 9h-17h', icon: 'support', color: '#00695C', category: 'Social' },
    { service: 'CAF des Yvelines', numero: '0810 25 78 10', horaires: 'Lun-Ven 9h-17h', icon: 'child_care', color: '#1565C0', category: 'Social' },
    { service: 'ADMR Poissy', numero: '01 30 74 24 84', horaires: 'Lun-Ven 9h-12h / 14h-17h', icon: 'elderly', color: '#00897B', category: 'Social', adresse: '81 rue Saint-Sébastien' },
    { service: 'Office de Tourisme Poissy', numero: '01 30 74 60 65', horaires: 'Voir site', icon: 'tour', color: '#1565C0', category: 'Social' },
  ];

  get filteredNumeros(): NumeroUtile[] {
    return this.allNumeros.filter(n => {
      const matchCat = this.activeFilter === 'Tous' || n.category === this.activeFilter;
      const matchSearch = !this.searchQuery ||
        n.service.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        n.numero.includes(this.searchQuery);
      return matchCat && matchSearch;
    });
  }

  call(numero: string): void {
    window.open(`tel:${numero}`);
  }

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
