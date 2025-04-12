import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NewsService } from '../../../services/news.service';
import { News } from '../../../models/news';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  news: News | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newsId = params.get('id');
      if (newsId) {
        this.loadNewsDetail(newsId);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadNewsDetail(id: string): void {
    this.loading = true;
    this.error = false;
    
    this.newsService.getNewsById(id)
      .subscribe({
        next: (news) => {
          console.log('Noticia completa recibida:', news); // Log de todo el objeto
          console.log('Propiedades de la noticia:', Object.keys(news)); // Ver propiedades
          this.news = news;
          
          // Verificación adicional y corrección en caso necesario
          if (!this.news.content) {
            console.warn('Content no encontrado, intentando recuperar de otra propiedad');
            // Intentar encontrar el contenido en otras propiedades si existen
            const newsAny = news as any;
            this.news.content = newsAny.html || newsAny.body || newsAny.description || '';
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar el detalle de la noticia:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/news']);
  }
  
  getSafeHtml(content: string | undefined): any {
    // Este método NO altera el HTML, solo lo marca como seguro para Angular
    return this.sanitizer.bypassSecurityTrustHtml(content || '');
  }
}