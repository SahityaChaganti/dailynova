import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { newsService } from '../../services/news';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.css',
})
export class News implements OnInit {
  private newsService = inject(newsService);
  private cdr = inject(ChangeDetectorRef);
  newsList: any[] = [];
  loading = true;

  ngOnInit() {
    this.newsService.getTopHeadlines().subscribe({
      next: (data: any) => {
        console.log('✅ News API response:', data.results);
        this.newsList = data.results || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching news:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  openLink(url: string) {
    window.open(url, '_blank');
  }
}
