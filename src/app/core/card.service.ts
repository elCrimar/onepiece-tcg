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

  // Obtener todas las cartas (todas las páginas)
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

  // Buscar cartas por nombre
  searchCards(name: string): Observable<Card[]> {
    return this.apiService.get<any>('cards', { name }).pipe(
      map(response => response.data)
    );
  }

  // Obtener detalles de una carta por ID
  getCardById(cardId: string): Observable<Card> {
    return this.apiService.get<any>(`cards/${cardId}`);
  }

  // Obtener cartas por página
  getCards(page: number, limit: number = 36): Observable<{ totalPages: number; data: Card[] }> {
    return this.apiService.get<any>('cards', { page, limit }).pipe(
      map(response => ({ totalPages: response.totalPages, data: response.data }))
    );
  }
}
