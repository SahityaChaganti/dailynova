import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  // 🧭 Using free, no-key API (Open-Meteo)
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Weather API Error:', error);
        return of({ error: true });
      })
    );
  }
}
