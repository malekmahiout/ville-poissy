import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { SignalementService } from '../../services/signalement.service';

export interface HeroSlide {
  titre: string;
  sousTitre: string;
  photo: string;
}

interface ServiceItem {
  titre: string;
  icon: string;
  route: string;
  couleur: string;
  bg: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, MatBadgeModule, MatRippleModule, NgFor, NgIf, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  unreadCount$ = this.notifService.unreadCount$;
  today = new Date();
  currentSlide = 0;
  photoOuverte: HeroSlide | null = null;
  private slideInterval: any;

  heroSlides: HeroSlide[] = [
    { titre: 'Hôtel de Ville', sousTitre: 'Cœur administratif de Poissy', photo: 'assets/photos/Hotel-de-ville.jpg' },
    { titre: 'Collégiale Notre-Dame', sousTitre: 'Monument historique du XIIe siècle', photo: 'assets/photos/Collegiale_poissy.jpg' },
    { titre: 'Marché de Poissy', sousTitre: 'Mar · Ven · Sam — produits frais et locaux', photo: 'assets/photos/marché-poissy.jpg' },
    { titre: 'Bords de Seine', sousTitre: 'Promenades et sports nautiques', photo: 'assets/photos/bords-de-seine.jpg' },
    { titre: 'Villa Savoye', sousTitre: 'Chef-d\'œuvre de Le Corbusier — UNESCO', photo: 'assets/photos/villa-savoye-poissy.jpg' },
    { titre: 'Centre-ville', sousTitre: 'Commerce, vie locale et animations', photo: 'assets/photos/centre-ville-poissy.jpg' },
    { titre: 'Parc Meissonier', sousTitre: 'Écrin de verdure au cœur de la ville', photo: 'assets/photos/parc-meissonnier-poissy.jpg' },
    { titre: 'Musée du Jouet', sousTitre: 'Plus de 12 000 jouets à travers les siècles', photo: 'assets/photos/musée-du-jouet-poissy.jpg' },
    { titre: 'Maison de Fer', sousTitre: 'Architecture industrielle unique des années 1890', photo: 'assets/photos/maison-de-fer-poissy.jpg' },
  ];

  services: ServiceItem[] = [
    { titre: 'Poissy AI',      icon: 'auto_awesome',    route: '/poissy-ai',      couleur: '#1565C0', bg: '#E3F2FD' },
    { titre: 'Signaler',       icon: 'report_problem',  route: '/signalements',   couleur: '#C62828', bg: '#FFEBEE' },
    { titre: 'Mobilité',       icon: 'directions_bus',  route: '/mobilite',       couleur: '#1565C0', bg: '#E3F2FD' },
    { titre: 'Actualités',     icon: 'article',         route: '/actualites',     couleur: '#1565C0', bg: '#E3F2FD' },
    { titre: 'Agenda',         icon: 'event',           route: '/agenda',         couleur: '#4A148C', bg: '#EDE7F6' },
    { titre: 'Commerces',      icon: 'storefront',      route: '/commerce',       couleur: '#E65100', bg: '#FFF3E0' },
    { titre: 'Artisans',       icon: 'handyman',        route: '/artisans',       couleur: '#2E7D32', bg: '#E8F5E9' },
    { titre: 'Associations',   icon: 'groups',          route: '/associations',   couleur: '#00695C', bg: '#E0F2F1' },
    { titre: 'Découvrir',      icon: 'explore',         route: '/decouvrir',      couleur: '#00897B', bg: '#E0F2F1' },
    { titre: 'Démarches',      icon: 'description',     route: '/demarches',      couleur: '#1B5E20', bg: '#E8F5E9' },
    { titre: 'Météo',          icon: 'wb_sunny',        route: '/meteo',          couleur: '#F59E0B', bg: '#FFFBEB' },
    { titre: 'Sécurité',       icon: 'local_police',    route: '/securite',       couleur: '#C62828', bg: '#FFEBEE' },
    { titre: 'Numéros',        icon: 'phone',           route: '/numeros-utiles', couleur: '#6A1B9A', bg: '#F3E5F5' },
  ];

  constructor(
    private router: Router,
    private notifService: NotificationService,
    private signalementService: SignalementService,
  ) {}

  ngOnInit(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    }, 4500);
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  setSlide(i: number) { this.currentSlide = i; }
  navigate(route: string) { this.router.navigate([route]); }
  ouvrirGalerie(slide: HeroSlide) { this.photoOuverte = slide; }
  fermerGalerie() { this.photoOuverte = null; }

  naviguerDecouvrir(slide: HeroSlide) {
    this.router.navigate(['/decouvrir'], { state: { titre: slide.titre } });
  }

  get dateLabel(): string {
    return this.today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  get signalStats() { return this.signalementService.getStats(); }
}
