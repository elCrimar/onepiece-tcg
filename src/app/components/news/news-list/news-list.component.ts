import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { News } from '../../../models/news';
import { NavbarComponent } from '../../navbar/navbar.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  news: News[] = [];
  loading = true;
  error = false;
  currentPage = 1;
  totalPages = 1;
  limit = 10;

  constructor(private newsService: NewsService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.newsService.getNewsByPage(this.currentPage, this.limit)
      .subscribe({
        next: (response) => {
          this.news = response.data;
          console.log('Noticias cargadas:', this.news);
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar noticias:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadNews();
    }
  }

  // Método auxiliar para extraer texto plano de HTML y limitar longitud
  getExcerpt(html: string | undefined): string {
    if (!html) return 'No hay contenido disponible';
    
    // Crear un elemento temporal para extraer texto del HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const text = tempElement.textContent || tempElement.innerText;
    
    // Limitar a 150 caracteres
    return text.substring(0, 150) + '...';
  }

  getSafeHtml(content: string | undefined): any {
    return this.sanitizer.bypassSecurityTrustHtml(content || '');
  }
}