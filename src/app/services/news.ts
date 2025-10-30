import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class newsService {
  private http = inject(HttpClient);
  private apiKey = 'YOUR_NEWSAPI_KEY'; // 🔑 replace with your key
  private baseUrl =
    'https://newsdata.io/api/1/latest?apikey=pub_729322a56e7b4eb08aafa2ff93240fc9&q=tech';

  getTopHeadlines(): Observable<any> {
    return this.http.get(`${this.baseUrl}`).pipe(
      catchError((error) => {
        console.error('News API Error:', error);
        return of({ articles: [] });
      })
    );
  }
}
