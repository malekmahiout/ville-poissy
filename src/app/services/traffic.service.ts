import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';

export interface TrafficSegment {
  road: string;
  direction: string;
  status: 'fluide' | 'ralenti' | 'dense' | 'bloque';
  label: string;
  color: string;
  speed: number;       // km/h actuel
  freeFlowSpeed: number;
}

// Clé API TomTom — gratuite sur https://developer.tomtom.com/
const TOMTOM_KEY = 'ZvAUlXVzSksKrbKkrIJWBpYx1d8vfMwz';

// Points GPS représentatifs pour chaque axe autour de Poissy
const ROAD_POINTS: { road: string; direction: string; lat: number; lon: number }[] = [
  { road: 'A13', direction: 'vers Paris',       lat: 48.9240, lon: 2.0380 },
  { road: 'A13', direction: 'vers Normandie',   lat: 48.9235, lon: 1.9920 },
  { road: 'N13', direction: 'Centre-ville',     lat: 48.9295, lon: 2.0250 },
  { road: 'RD30', direction: 'vers Conflans',   lat: 48.9570, lon: 2.0470 },
];

@Injectable({ providedIn: 'root' })
export class TrafficService {

  constructor(private http: HttpClient) {}

  getTraffic(): Observable<TrafficSegment[]> {
    const requests = ROAD_POINTS.map(pt => {
      const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json`;
      const params = { point: `${pt.lat},${pt.lon}`, key: TOMTOM_KEY };

      return this.http.get<any>(url, { params }).pipe(
        map(res => {
          const data = res.flowSegmentData;
          const speed = Math.round(data.currentSpeed);
          const freeFlow = Math.round(data.freeFlowSpeed);
          const ratio = speed / freeFlow;

          let status: TrafficSegment['status'];
          let label: string;
          let color: string;

          if (ratio >= 0.8) {
            status = 'fluide'; label = 'Fluide'; color = '#2E7D32';
          } else if (ratio >= 0.55) {
            status = 'ralenti'; label = 'Ralenti'; color = '#F57C00';
          } else if (ratio >= 0.30) {
            status = 'dense'; label = 'Dense'; color = '#D32F2F';
          } else {
            status = 'bloque'; label = 'Bloqué'; color = '#B71C1C';
          }

          return { road: pt.road, direction: pt.direction, status, label, color, speed, freeFlowSpeed: freeFlow };
        }),
        catchError(() => of({
          road: pt.road, direction: pt.direction,
          status: 'fluide' as const, label: '—', color: '#9E9E9E',
          speed: 0, freeFlowSpeed: 0,
        }))
      );
    });

    return forkJoin(requests);
  }
}
