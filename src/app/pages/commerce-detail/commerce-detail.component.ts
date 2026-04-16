import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { Commerce } from '../commerce/commerce.component';

@Component({
  selector: 'app-commerce-detail',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './commerce-detail.component.html',
  styleUrl: './commerce-detail.component.scss',
})
export class CommerceDetailComponent implements OnInit {
  commerce: Commerce | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { commerce: Commerce } | undefined;
    if (state?.commerce) {
      this.commerce = state.commerce;
    } else {
      const s = (window.history.state as any)?.commerce;
      if (s) this.commerce = s;
      else this.router.navigate(['/commerce']);
    }
  }

  appeler(): void {
    if (this.commerce?.telephone) window.location.href = `tel:${this.commerce.telephone}`;
  }

  ouvrirMaps(): void {
    if (this.commerce?.adresse) {
      const q = encodeURIComponent(this.commerce.adresse);
      window.open(`https://maps.google.com/?q=${q}`, '_blank');
    }
  }

  ouvrirSite(): void {
    if (this.commerce?.site) window.open(this.commerce.site, '_blank');
    else window.open('https://ville-poissy.fr/images/pdf/economie/listecommerces.pdf', '_blank');
  }

  goBack(): void { this.router.navigate(['/commerce']); }
}
