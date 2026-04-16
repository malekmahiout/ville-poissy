import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';

interface MeteoJour {
  date: string;
  codeMeteo: number;
  tempMax: number;
  tempMin: number;
  precipitations: number;
}

@Component({
  selector: 'app-meteo',
  standalone: true,
  imports: [MatIconModule, NgFor, NgIf, DecimalPipe],
  templateUrl: './meteo.component.html',
  styleUrl: './meteo.component.scss'
})
export class MeteoComponent implements OnInit {
  loading = true;
  error = false;

  temperatureActuelle: number = 0;
  temperatureRessentie: number = 0;
  humidite: number = 0;
  ventKmh: number = 0;
  codeMeteoActuel: number = 0;
  precipitation: number = 0;

  previsions: MeteoJour[] = [];

  private readonly LAT = 48.9286;
  private readonly LNG = 2.0447;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void { this.chargerMeteo(); }

  chargerMeteo(): void {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.LAT}&longitude=${this.LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe%2FParis&forecast_days=7`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.temperatureActuelle = Math.round(data.current.temperature_2m);
        this.temperatureRessentie = Math.round(data.current.apparent_temperature);
        this.humidite = data.current.relative_humidity_2m;
        this.ventKmh = Math.round(data.current.wind_speed_10m);
        this.codeMeteoActuel = data.current.weather_code;
        this.precipitation = data.current.precipitation;

        this.previsions = data.daily.time.map((date: string, i: number) => ({
          date,
          codeMeteo: data.daily.weather_code[i],
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          precipitations: data.daily.precipitation_sum[i]
        }));
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  getWeatherIcon(code: number): string {
    if (code === 0) return 'wb_sunny';
    if (code <= 3) return 'partly_cloudy_day';
    if (code <= 49) return 'foggy';
    if (code <= 67) return 'grain';
    if (code <= 77) return 'ac_unit';
    if (code <= 82) return 'shower';
    if (code <= 99) return 'thunderstorm';
    return 'cloud';
  }

  getWeatherLabel(code: number): string {
    if (code === 0) return 'Ensoleillé';
    if (code <= 2) return 'Partiellement nuageux';
    if (code === 3) return 'Couvert';
    if (code <= 49) return 'Brouillard';
    if (code <= 55) return 'Bruine';
    if (code <= 67) return 'Pluie';
    if (code <= 77) return 'Neige';
    if (code <= 82) return 'Averses';
    if (code <= 99) return 'Orage';
    return 'Variable';
  }

  getWeatherColor(code: number): string {
    if (code === 0) return '#F59E0B';
    if (code <= 3) return '#6B7280';
    if (code <= 49) return '#94A3B8';
    if (code <= 67) return '#3B82F6';
    if (code <= 77) return '#BAE6FD';
    if (code <= 82) return '#2563EB';
    if (code <= 99) return '#7C3AED';
    return '#6B7280';
  }

  getDayLabel(dateStr: string, i: number): string {
    if (i === 0) return "Aujourd'hui";
    if (i === 1) return 'Demain';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  }

  goBack(): void { this.router.navigate(['/home']); }
}
