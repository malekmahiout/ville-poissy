import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { NgFor, NgIf, NgClass, NgSwitch, NgSwitchCase, DatePipe, SlicePipe } from '@angular/common';
import { Departure, SncfService } from '../../services/sncf.service';
import { TrafficSegment, TrafficService } from '../../services/traffic.service';

interface ParkingZone {
  name: string;
  dispo: number;
  total: number;
  type: string;
  color: string;
}

@Component({
  selector: 'app-mobilite',
  standalone: true,
  imports: [MatIconModule, MatRippleModule, NgFor, NgIf, NgClass, NgSwitch, NgSwitchCase, DatePipe, SlicePipe],
  templateUrl: './mobilite.component.html',
  styleUrl: './mobilite.component.scss'
})
export class MobiliteComponent implements OnInit, OnDestroy {

  departures: Departure[] = [];
  trafficSegments: TrafficSegment[] = [];
  loadingTrains = true;
  loadingTraffic = true;
  errorTrains = false;
  now = new Date();

  parkings: ParkingZone[] = [
    { name: 'Parking Mairie',       dispo: 45, total: 120, type: 'Gratuit', color: '#2E7D32' },
    { name: 'Parking du Marché',    dispo: 12, total: 80,  type: 'Payant',  color: '#F57C00' },
    { name: 'Parking Gare SNCF',    dispo: 3,  total: 200, type: 'Payant',  color: '#D32F2F' },
    { name: 'Parking Poissy-Centre',dispo: 78, total: 150, type: 'Payant',  color: '#2E7D32' },
  ];

  private trainInterval: any;
  private trafficInterval: any;
  private clockInterval: any;

  constructor(
    private router: Router,
    private sncf: SncfService,
    private trafficSvc: TrafficService
  ) {}

  ngOnInit(): void {
    this.loadDepartures();
    this.loadTraffic();

    this.trainInterval   = setInterval(() => this.loadDepartures(), 60_000);
    this.trafficInterval = setInterval(() => this.loadTraffic(), 120_000);
    this.clockInterval   = setInterval(() => this.now = new Date(), 1_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.trainInterval);
    clearInterval(this.trafficInterval);
    clearInterval(this.clockInterval);
  }

  private loadDepartures(): void {
    this.errorTrains = false;
    this.sncf.getDepartures().subscribe({
      next: deps => { this.departures = deps; this.loadingTrains = false; },
      error: () => { this.loadingTrains = false; this.errorTrains = true; }
    });
  }

  private loadTraffic(): void {
    this.trafficSvc.getTraffic().subscribe({
      next: segs => { this.trafficSegments = segs; this.loadingTraffic = false; },
      error: () => { this.loadingTraffic = false; }
    });
  }

  retryTrains(): void {
    this.loadingTrains = true;
    this.loadDepartures();
  }

  getParkingPercent(p: ParkingZone): number {
    return Math.round((p.dispo / p.total) * 100);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
