import { Component } from '@angular/core';
import { News } from '../../components/news/news';
import { Weather } from '../../components/weather/weather';
import { Layout } from '../../core/layout/layout';
import { CommonModule } from '@angular/common';
import { AiSummary } from '../../components/ai-summary/ai-summary';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, News, Weather, AiSummary],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
