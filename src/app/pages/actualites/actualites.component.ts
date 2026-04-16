import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { ActualitesService, ActualiteItem } from '../../services/actualites.service';

@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.scss',
})
export class ActualitesComponent implements OnInit {
  actualites: ActualiteItem[] = [];
  loading = true;

  constructor(
    private actualitesService: ActualitesService,
    private router: Router,
  ) {}

  afficherTout = false;

  ngOnInit(): void {
    this.actualitesService.getAllActualites().subscribe(items => {
      this.actualites = items;
      this.loading = false;
    });
  }

  get actualitesAffichees() {
    return this.afficherTout ? this.actualites : this.actualites.slice(0, 5);
  }

  toggleAfficherTout(): void { this.afficherTout = !this.afficherTout; }

  ouvrirActualite(item: ActualiteItem): void {
    this.router.navigate(['/actualite-detail'], { state: { item } });
  }

  ouvrirSiteOfficiel(): void {
    window.open('https://www.ville-poissy.fr/index.php/actualites.html', '_blank');
  }

  goBack(): void { this.router.navigate(['/home']); }
}
