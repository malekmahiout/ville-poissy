import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { ActualiteItem } from '../../services/actualites.service';

@Component({
  selector: 'app-actualite-detail',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgIf],
  templateUrl: './actualite-detail.component.html',
  styleUrl: './actualite-detail.component.scss',
})
export class ActualiteDetailComponent implements OnInit {
  item: ActualiteItem | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { item: ActualiteItem } | undefined;
    if (state?.item) {
      this.item = state.item;
    } else {
      // Try history.state fallback
      const s = (window.history.state as any)?.item;
      if (s) this.item = s;
      else this.router.navigate(['/actualites']);
    }
  }

  ouvrirSite(): void {
    if (this.item?.lien) window.open(this.item.lien, '_blank');
    else window.open('https://www.ville-poissy.fr/index.php/actualites.html', '_blank');
  }

  goBack(): void { this.router.navigate(['/actualites']); }
}
