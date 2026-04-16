import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf } from '@angular/common';
import * as L from 'leaflet';

interface Contact {
  name: string;
  number: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-securite',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf],
  templateUrl: './securite.component.html',
  styleUrl: './securite.component.scss'
})
export class SecuriteComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map: L.Map | null = null;

  emergencyContacts: Contact[] = [
    { name: 'Police Nationale', number: '01 39 22 27 27', description: 'Commissariat – 16 Bd Louis-Lemelle · 24h/24', icon: 'security', color: '#0D47A1' },
    { name: 'Police Municipale', number: '01 39 22 31 15', description: '20 rue Jean-Claude-Mary · Lun-Sam 9h-18h', icon: 'local_police', color: '#1565C0' },
    { name: 'SAMU', number: '15', description: 'Urgences médicales · 24h/24', icon: 'local_hospital', color: '#C62828' },
    { name: 'Pompiers (SDIS 78)', number: '18', description: 'Secours et incendie · 24h/24', icon: 'local_fire_department', color: '#E53935' },
    { name: 'Numéro d\'urgence européen', number: '112', description: 'Tous services d\'urgence · 24h/24', icon: 'sos', color: '#B71C1C' },
    { name: 'Fourrière municipale', number: '01 39 22 31 65', description: 'Enlèvement de véhicules', icon: 'directions_car', color: '#37474F' },
  ];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement) return;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [48.9287, 2.0390],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(this.map);

    const makeIcon = (emoji: string, bg: string) => L.divIcon({
      html: `<div style="background:${bg};color:white;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 2px 8px rgba(0,0,0,0.35)">${emoji}</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      className: '',
    });

    L.marker([48.9295, 2.0370], { icon: makeIcon('🚔', '#0D47A1') })
      .addTo(this.map)
      .bindPopup('<b>Commissariat de Police Nationale</b><br>16 Bd Louis-Lemelle<br>☎ 01 39 22 27 27');

    L.marker([48.9272, 2.0405], { icon: makeIcon('👮', '#1565C0') })
      .addTo(this.map)
      .bindPopup('<b>Police Municipale</b><br>20 rue Jean-Claude-Mary');

    L.marker([48.9280, 2.0350], { icon: makeIcon('🚒', '#E53935') })
      .addTo(this.map)
      .bindPopup('<b>Pompiers – SDIS 78</b><br>160 Avenue de la Maladrerie<br>☎ 18');
  }

  call(number: string): void {
    window.open(`tel:${number}`);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
