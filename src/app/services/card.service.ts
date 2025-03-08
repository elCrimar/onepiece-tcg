import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Card } from '../../app/models/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private apiService: ApiService) {}

  // Método para cargar cartas por página (sin filtros específicos)
  getCardsByPage(page: number, limit: number): Observable<{ totalPages: number; data: Card[] }> {
    return this.apiService.get<any>('cards', { page, limit }).pipe(
      map(response => ({
        totalPages: response.totalPages,
        data: response.data
      }))
    );
  }

  // Buscar cartas por nombre con filtros y paginación
  searchCards(filters: any, page: number, limit: number): Observable<{ totalPages: number; data: Card[] }> {
    return this.apiService.get<any>('cards', { ...filters, page, limit }).pipe(
      map(response => response)
    );
  }

  // Obtener todas las cartas (todas las páginas) - no lo usaremos más
  getAllCards(): Observable<Card[]> {
    const limit = 100; // Máximo permitido por la API
    // Primera petición (página 1)
    return this.apiService.get<any>('cards', { limit, page: 1 }).pipe(
      concatMap(response => {
        const totalPages = response.totalPages;
        const allData = response.data;
        const requests: Observable<Card[]>[] = [];

        // Crear peticiones para cada página a partir de la 2
        for (let page = 2; page <= totalPages; page++) {
          requests.push(
            this.apiService.get<any>('cards', { limit, page }).pipe(
              map(resp => resp.data)
            )
          );
        }
        // Si hay más páginas, combinar los resultados
        if (requests.length) {
          return forkJoin(requests).pipe(
            map(pagesData => allData.concat(...pagesData))
          );
        }
        // Si solo hay una página, devolver directamente
        return of(allData);
      })
    );
  }
}
