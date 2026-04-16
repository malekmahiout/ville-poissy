import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface Departure {
  scheduledTime: string;
  realTime: string;
  isDelayed: boolean;
  delayMinutes: number;
  isCancelled: boolean;
  missionCode: string;
  destination: string;
  platform: string;
  line: string;
  lineColor: string;
  textColor: string;
  commercialMode: string;
  status: 'ontime' | 'delayed' | 'cancelled';
}

// Clé API Île-de-France Mobilités (PRIM)
const IDFM_API_KEY = 'caRyVJNi2mrXqX6bZTwG0KoZiKxSa2qu';

// Identifiant SIRI de la gare de Poissy (stop area SP)
const POISSY_MONITORING_REF = 'STIF:StopArea:SP:47874:';

// Couleurs officielles des lignes
const LINE_STYLES: Record<string, { code: string; color: string; textColor: string; mode: string }> = {
  'STIF:Line::C01742:': { code: 'A',  color: '#E2231A', textColor: '#FFFFFF', mode: 'RER' },
  'STIF:Line::C01739:': { code: 'J',  color: '#D2007A', textColor: '#FFFFFF', mode: 'TRANSILIEN' },
};

@Injectable({ providedIn: 'root' })
export class SncfService {

  constructor(private http: HttpClient) {}

  getDepartures(): Observable<Departure[]> {
    const url = `https://prim.iledefrance-mobilites.fr/marketplace/stop-monitoring`;
    const headers = new HttpHeaders({ apikey: IDFM_API_KEY });
    const params = { MonitoringRef: POISSY_MONITORING_REF };

    return this.http.get<any>(url, { headers, params }).pipe(
      map(res => {
        const visits: any[] = res?.Siri?.ServiceDelivery
          ?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit ?? [];
        return this.parse(visits);
      }),
      catchError(() => of([]))
    );
  }

  private parse(visits: any[]): Departure[] {
    const now = new Date();

    return visits
      .map(v => {
        const jny   = v.MonitoredVehicleJourney;
        const call  = jny.MonitoredCall ?? {};
        const lineRef = jny.LineRef?.value ?? '';
        const style = LINE_STYLES[lineRef] ?? { code: lineRef, color: '#888888', textColor: '#FFFFFF', mode: 'TRAIN' };

        const aimed    = call.AimedDepartureTime    ? new Date(call.AimedDepartureTime)    : null;
        const expected = call.ExpectedDepartureTime ? new Date(call.ExpectedDepartureTime) : aimed;

        if (!expected) return null;

        const statusRaw = (call.DepartureStatus ?? '').toUpperCase();
        const isCancelled = statusRaw === 'CANCELLED' || statusRaw === 'NO_CALL';
        const delayMs     = aimed && expected ? expected.getTime() - aimed.getTime() : 0;
        const delayMin    = Math.max(0, Math.round(delayMs / 60000));
        const isDelayed   = delayMin > 0 && !isCancelled;

        let status: Departure['status'] = 'ontime';
        if (isCancelled) status = 'cancelled';
        else if (isDelayed) status = 'delayed';

        const missionArr = jny.VehicleJourneyName ?? [];
        const missionCode = missionArr[0]?.value ?? '';

        const destination = (jny.DestinationName?.[0]?.value ?? '')
          .replace('Paris Saint-Lazare', 'Paris St-Lazare')
          .trim();

        const platform = call.DeparturePlatformName?.value
          ?? call.ArrivalPlatformName?.value
          ?? '';

        return {
          scheduledTime:  aimed    ? this.fmt(aimed)    : this.fmt(expected),
          realTime:       expected ? this.fmt(expected) : '',
          isDelayed,
          delayMinutes:   delayMin,
          isCancelled,
          missionCode,
          destination,
          platform,
          line:          style.code,
          lineColor:     style.color,
          textColor:     style.textColor,
          commercialMode: style.mode,
          status,
        } as Departure;
      })
      .filter((d): d is Departure => d !== null && new Date() <= this.addMinutes(this.parseTime(d.realTime || d.scheduledTime), 1))
      .sort((a, b) => (a.realTime || a.scheduledTime).localeCompare(b.realTime || b.scheduledTime));
  }

  private fmt(d: Date): string {
    return d.getHours().toString().padStart(2, '0')
      + ':' + d.getMinutes().toString().padStart(2, '0');
  }

  private parseTime(t: string): Date {
    const [h, m] = t.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }

  private addMinutes(d: Date, min: number): Date {
    return new Date(d.getTime() + min * 60000);
  }
}
