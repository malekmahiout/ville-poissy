import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { AgendaItem } from '../../services/actualites.service';

@Component({
  selector: 'app-agenda-detail',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgIf],
  templateUrl: './agenda-detail.component.html',
  styleUrl: './agenda-detail.component.scss',
})
export class AgendaDetailComponent implements OnInit {
  item: AgendaItem | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { item: AgendaItem } | undefined;
    if (state?.item) {
      this.item = state.item;
    } else {
      const s = (window.history.state as any)?.item;
      if (s) this.item = s;
      else this.router.navigate(['/agenda']);
    }
  }

  ouvrirSite(): void {
    if (this.item?.lien) window.open(this.item.lien, '_blank');
    else window.open('https://www.ville-poissy.fr/index.php/agenda.html', '_blank');
  }

  goBack(): void { this.router.navigate(['/agenda']); }
}
