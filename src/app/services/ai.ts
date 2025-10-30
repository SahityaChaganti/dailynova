import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { newsService } from './news';

@Injectable({ providedIn: 'root' })
export class AiSummaryService {
  private http = inject(HttpClient);
  private news = inject(newsService);

  // Replace this with your real OpenAI / Gemini endpoint
  private aiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = 'YOUR_OPENAI_API_KEY'; // <-- store in env later

  getDailySummary(): Observable<string> {
    return this.news.getTopHeadlines().pipe(
      switchMap((news: any) => {
        const headlines = news.results
          ?.slice(0, 5)
          .map((n: any) => n.title)
          .join('\n');

        const body = {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Summarize these headlines into 2 sentences in a friendly, concise tone.',
            },
            { role: 'user', content: headlines },
          ],
          temperature: 0.7,
          max_tokens: 80,
        };

        return this.http
          .post<any>(this.aiUrl, body, {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((res) => res.choices?.[0]?.message?.content?.trim() ?? ''));
      })
    );
  }
}
