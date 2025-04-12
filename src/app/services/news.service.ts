import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, tap, map } from 'rxjs';
import { ApiService } from './api.service';
import { News } from '../models/news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private apiService: ApiService) {}

  // Obtener todas las noticias con paginación
  getNewsByPage(page: number, limit: number): Observable<{ totalPages: number; data: News[] }> {
    return this.apiService.get<{ totalPages: number; data: News[] }>('news', { page, limit })
      .pipe(
        catchError(error => {
          console.error('Error fetching news:', error);
          return throwError(() => new Error('Error al obtener noticias'));
        })
      );
  }

  // Obtener una noticia específica por ID
  getNewsById(id: string): Observable<News> {
    return this.apiService.get<any>(`news/${id}`).pipe(
      tap(response => console.log('Respuesta original API:', response)),
      map(response => {
        // Extraer la noticia desde la propiedad 'data' de la respuesta
        const newsData = response.data;
        
        // Verificar si tenemos datos válidos
        if (!newsData) {
          console.error('No se encontraron datos en la respuesta:', response);
          throw new Error('Datos de noticia no encontrados');
        }
        
        // Mapear a nuestro modelo News
        return {
          id: newsData.id,
          title: newsData.title,
          author: newsData.author,
          content: newsData.content || '',
          created_at: newsData.created_at,
          updated_at: newsData.updated_at,
          image: newsData.image,
          category: newsData.category,
          tags: newsData.tags
        };
      }),
      catchError(error => {
        console.error(`Error procesando la noticia con ID ${id}:`, error);
        return throwError(() => new Error('Error al obtener la noticia'));
      })
    );
  }
}
