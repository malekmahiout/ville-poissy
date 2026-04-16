import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import { ActualitesService, AgendaItem } from '../../services/actualites.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent implements OnInit {
  events: AgendaItem[] = [];
  loading = true;
  afficherTout = false;

  constructor(
    private actualitesService: ActualitesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.actualitesService.getAgenda().subscribe(items => {
      this.events = items;
      this.loading = false;
    });
  }

  get eventsAffiches() {
    return this.afficherTout ? this.events : this.events.slice(0, 5);
  }

  toggleAfficherTout(): void { this.afficherTout = !this.afficherTout; }

  ouvrirEvenement(event: AgendaItem): void {
    this.router.navigate(['/agenda-detail'], { state: { item: event } });
  }

  ouvrirAgendaOfficiel(): void {
    window.open('https://www.ville-poissy.fr/index.php/agenda.html', '_blank');
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
