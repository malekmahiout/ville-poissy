import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { COMMERCES_DATA } from '../../data/commerces.data';

export interface Commerce {
  nom: string;
  categorie: string;
  catIcon: string;
  catCouleur: string;
  adresse: string;
  telephone?: string;
  horaires?: string;
  description?: string;
  site?: string;
  tags?: string[];
}


@Component({
  selector: 'app-commerce',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './commerce.component.html',
  styleUrl: './commerce.component.scss',
})
export class CommerceComponent implements OnInit {
  allCommerces = COMMERCES_DATA;
  filteredCommerces: Commerce[] = [];
  selectedCategory = 'Toutes';
  searchQuery = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredCommerces = [...this.allCommerces];
  }

  filterByCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.allCommerces;
    if (this.selectedCategory !== 'Toutes') {
      result = result.filter(c => c.categorie === this.selectedCategory);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c =>
        c.nom.toLowerCase().includes(q) ||
        c.categorie.toLowerCase().includes(q) ||
        c.adresse.toLowerCase().includes(q) ||
        c.tags?.some(t => t.includes(q))
      );
    }
    this.filteredCommerces = result;
  }

  ouvrirDetail(commerce: Commerce): void {
    this.router.navigate(['/commerce-detail'], { state: { commerce } });
  }

  appeler(tel: string): void {
    window.location.href = `tel:${tel}`;
  }

  ouvrirAnnuaire(): void {
    window.open('https://ville-poissy.fr/images/pdf/economie/listecommerces.pdf', '_blank');
  }

  goBack(): void { this.router.navigate(['/home']); }

  get usedCategories(): string[] {
    const used = new Set(this.allCommerces.map(c => c.categorie));
    return ['Toutes', ...Array.from(used)];
  }
}
