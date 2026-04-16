import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { Commerce } from '../commerce/commerce.component';
import { ARTISANS_DATA } from '../../data/artisans.data';

@Component({
  selector: 'app-artisan',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './artisan.component.html',
  styleUrl: './artisan.component.scss',
})
export class ArtisanComponent implements OnInit {
  allArtisans = ARTISANS_DATA;
  filteredArtisans: Commerce[] = [];
  selectedCategory = 'Toutes';
  searchQuery = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredArtisans = [...this.allArtisans];
  }

  filterByCategory(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.allArtisans;
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
    this.filteredArtisans = result;
  }

  ouvrirDetail(artisan: Commerce): void {
    this.router.navigate(['/commerce-detail'], { state: { commerce: artisan } });
  }

  appeler(tel: string): void {
    window.location.href = `tel:${tel}`;
  }

  goBack(): void { this.router.navigate(['/home']); }

  get usedCategories(): string[] {
    const used = new Set(this.allArtisans.map(c => c.categorie));
    return ['Toutes', ...Array.from(used)];
  }
}
