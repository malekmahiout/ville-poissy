import { Injectable } from '@angular/core';
import { Signalement } from '../models/signalement.model';

const STORAGE_KEY = 'poissy_signalements';

@Injectable({ providedIn: 'root' })
export class SignalementService {
  private signalements: Signalement[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      this.signalements = data ? JSON.parse(data) : this.getSampleData();
    } catch {
      this.signalements = this.getSampleData();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.signalements));
  }

  private getSampleData(): Signalement[] {
    return [
      {
        id: '1',
        categorie: 'Propreté',
        categorieIcon: 'delete_outline',
        description: 'Poubelle renversée rue de Paris, déchets répandus sur le trottoir.',
        statut: 'traite',
        lat: 48.9286,
        lng: 2.0447,
        adresse: 'Rue de Paris, Poissy',
        dateCreation: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
        dateIntervention: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
      },
      {
        id: '2',
        categorie: 'Dépôt sauvage',
        categorieIcon: 'delete_forever',
        description: 'Dépôt de meubles abandonnés au pied de l\'immeuble.',
        statut: 'en-cours',
        lat: 48.9312,
        lng: 2.0501,
        adresse: 'Avenue du Général Leclerc, Poissy',
        dateCreation: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
      },
    ];
  }

  getAll(): Signalement[] {
    return [...this.signalements].sort((a, b) =>
      new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    );
  }

  getById(id: string): Signalement | undefined {
    return this.signalements.find(s => s.id === id);
  }

  create(signalement: Omit<Signalement, 'id' | 'dateCreation' | 'statut'>): Signalement {
    const newSignalement: Signalement = {
      ...signalement,
      id: Date.now().toString(),
      statut: 'nouveau',
      dateCreation: new Date().toISOString(),
    };
    this.signalements.unshift(newSignalement);
    this.saveToStorage();
    return newSignalement;
  }

  updateStatut(id: string, statut: Signalement['statut'], dateIntervention?: string): void {
    const idx = this.signalements.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.signalements[idx] = {
        ...this.signalements[idx],
        statut,
        dateIntervention: dateIntervention || this.signalements[idx].dateIntervention,
      };
      this.saveToStorage();
    }
  }

  delete(id: string): void {
    this.signalements = this.signalements.filter(s => s.id !== id);
    this.saveToStorage();
  }

  getStats(): { total: number; nouveau: number; enCours: number; traite: number } {
    const total = this.signalements.length;
    const nouveau = this.signalements.filter(s => s.statut === 'nouveau').length;
    const enCours = this.signalements.filter(s => s.statut === 'en-cours').length;
    const traite = this.signalements.filter(s => s.statut === 'traite').length;
    return { total, nouveau, enCours, traite };
  }
}
