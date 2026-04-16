import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { NotificationService } from './services/notification.service';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatBadgeModule, AsyncPipe, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Ville de Poissy';

  navItems: NavItem[] = [
    { path: '/home', icon: 'home', label: 'Accueil' },
    { path: '/signalements', icon: 'report_problem', label: 'Signaler' },
    { path: '/securite', icon: 'local_police', label: 'Sécurité' },
    { path: '/agenda', icon: 'event', label: 'Agenda' },
    { path: '/notifications', icon: 'notifications', label: 'Alertes' },
  ];

  unreadCount$ = this.notifService.unreadCount$;

  constructor(
    private notifService: NotificationService,
    public router: Router
  ) {}

  ngOnInit(): void {}
}
