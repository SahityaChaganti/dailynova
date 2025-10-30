import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../../services/weather';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.html',
  styleUrls: ['./weather.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Weather implements OnInit {
  weather: any = null;
  forecast: any[] = [];
  locationName = '';
  loading = true;
  error: string | null = null;

  private weatherService = inject(WeatherService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getUserLocation();
  }

  /** Get user’s live location */
  getUserLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          this.fetchWeather(latitude, longitude);
          this.fetchForecast(latitude, longitude);
          this.fetchLocationName(latitude, longitude);
        },
        () => this.useFallbackLocation()
      );
    } else {
      this.useFallbackLocation();
    }
  }

  /** Default to London if location blocked */
  private useFallbackLocation(): void {
    this.error = 'Unable to access location — showing London.';
    const lat = 51.5072,
      lon = -0.1276;
    this.fetchWeather(lat, lon);
    this.fetchForecast(lat, lon);
    this.fetchLocationName(lat, lon);
    this.cdr.markForCheck();
  }

  /** Fetch current weather */
  fetchWeather(lat: number, lon: number): void {
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (data: any) => {
        this.weather = data?.current_weather || null;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load current weather.';
        this.cdr.markForCheck();
      },
    });
  }

  /** Fetch 10-day forecast */
  fetchForecast(lat: number, lon: number): void {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    this.http.get(url).subscribe({
      next: (res: any) => {
        const days = res?.daily?.time || [];
        this.forecast = days.map((date: string, i: number) => ({
          date,
          max: res.daily.temperature_2m_max[i],
          min: res.daily.temperature_2m_min[i],
          code: res.daily.weathercode[i],
        }));
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Forecast error:', err);
        this.forecast = [];
        this.cdr.markForCheck();
      },
    });
  }

  /** Reverse geocode to get readable name */
  fetchLocationName(lat: number, lon: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.locationName =
          res?.address?.city ||
          res?.address?.town ||
          res?.address?.village ||
          res?.display_name ||
          'Unknown';
        this.cdr.markForCheck();
      },
      error: () => {
        this.locationName = 'Unknown';
        this.cdr.markForCheck();
      },
    });
  }

  /** Map weather codes to emoji */
  getWeatherEmoji(code: number): string {
    const map: Record<number, string> = {
      0: '☀️',
      1: '🌤️',
      2: '⛅',
      3: '☁️',
      45: '🌫️',
      48: '🌫️',
      51: '🌦️',
      61: '🌧️',
      71: '❄️',
      95: '⛈️',
    };
    return map[code] || '🌍';
  }
}
