import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalementService } from '../../services/signalement.service';
import { Signalement } from '../../models/signalement.model';

@Component({
  selector: 'app-signalement-list',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf, DatePipe, DecimalPipe, FormsModule],
  templateUrl: './signalement-list.component.html',
  styleUrl: './signalement-list.component.scss'
})
export class SignalementListComponent implements OnInit {
  private allSignalements: Signalement[] = [];
  stats = { total: 0, nouveau: 0, enCours: 0, traite: 0 };

  searchText = '';
  dateDebut = '';
  dateFin = '';
  filtreStatut = '';

  constructor(private signalementService: SignalementService, public router: Router) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.allSignalements = this.signalementService.getAll();
    this.stats = this.signalementService.getStats();
  }

  get signalementsFiltres(): Signalement[] {
    return this.allSignalements.filter(s => {
      const matchSearch = !this.searchText ||
        s.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.categorie.toLowerCase().includes(this.searchText.toLowerCase());
      const date = new Date(s.dateCreation);
      const matchDebut = !this.dateDebut || date >= new Date(this.dateDebut);
      const matchFin = !this.dateFin || date <= new Date(this.dateFin + 'T23:59:59');
      const matchStatut = !this.filtreStatut || s.statut === this.filtreStatut;
      return matchSearch && matchDebut && matchFin && matchStatut;
    });
  }

  get hasFilters(): boolean {
    return !!(this.searchText || this.dateDebut || this.dateFin || this.filtreStatut);
  }

  resetFilters(): void {
    this.searchText = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.filtreStatut = '';
  }

  navigateToCreate(): void { this.router.navigate(['/signalements/nouveau']); }

  getStatutLabel(statut: string): string {
    return { 'nouveau': 'Nouveau', 'en-cours': 'En cours', 'traite': 'Traité' }[statut] || statut;
  }

  getStatutIcon(statut: string): string {
    return { 'nouveau': 'fiber_new', 'en-cours': 'pending', 'traite': 'check_circle' }[statut] || 'help';
  }

  deleteSignalement(id: string, event: Event): void {
    event.stopPropagation();
    this.signalementService.delete(id);
    this.loadData();
  }
}
