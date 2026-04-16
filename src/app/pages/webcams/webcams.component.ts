import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';

interface Webcam {
  id: number;
  name: string;
  location: string;
  thumbnail: string;
  status: 'live' | 'offline';
}

@Component({
  selector: 'app-webcams',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './webcams.component.html',
  styleUrl: './webcams.component.scss'
})
export class WebcamsComponent {
  webcams: Webcam[] = [
    { id: 1, name: 'Place du Marché', location: 'Centre-ville', thumbnail: '', status: 'live' },
    { id: 2, name: 'Rue de Paris', location: 'Axe principal', thumbnail: '', status: 'live' },
    { id: 3, name: 'Gare SNCF Poissy', location: 'Entrée principale', thumbnail: '', status: 'live' },
    { id: 4, name: 'Parc de la Mairie', location: 'Allée centrale', thumbnail: '', status: 'offline' },
    { id: 5, name: 'Collège Simone Veil', location: 'Entrée élèves', thumbnail: '', status: 'live' },
    { id: 6, name: 'Avenue de Verdun', location: 'Carrefour central', thumbnail: '', status: 'live' },
  ];

  selectedCam: Webcam | null = null;

  constructor(private router: Router) {}

  selectCam(cam: Webcam): void {
    if (cam.status === 'live') {
      this.selectedCam = cam;
    }
  }

  closeCam(): void {
    this.selectedCam = null;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
