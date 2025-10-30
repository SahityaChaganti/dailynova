import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiSummaryService } from '../../services/ai';

@Component({
  selector: 'app-ai-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-summary.html',
  styleUrls: ['./ai-summary.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSummary implements OnInit {
  private aiService = inject(AiSummaryService);
  private cdr = inject(ChangeDetectorRef);

  summary = '';
  loading = true;

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.loading = true;
    this.aiService.getDailySummary().subscribe({
      next: (text) => {
        this.summary = text || 'No summary available today.';
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('AI Summary error:', err);
        this.summary = 'Failed to fetch summary.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
