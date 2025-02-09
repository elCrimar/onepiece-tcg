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

  /**
   * Variables para el filtro por code:
   * Aquí indicas el prefijo para cada expansión.
   */
  public opCodes = {
    OP01: "OP01-",
    OP02: "OP02-",
    OP03: "OP03-",
    OP04: "OP04-",
    OP05: "OP05-",
    OP06: "OP06-",
    OP07: "OP07-",
    OP08: "OP08-",
    OP09: "OP09-"
  };

  public ebCode = "EB01-";

  public stCodes = {
    ST01: "ST01-",
    ST02: "ST02-",
    ST03: "ST03-",
    ST04: "ST04-",
    ST05: "ST05-",
    ST06: "ST06-",
    ST07: "ST07-",
    ST08: "ST08-",
    ST09: "ST09-",
    ST10: "ST10-",
    ST11: "ST11-",
    ST12: "ST12-",
    ST13: "ST13-",
    ST14: "ST14-",
    ST15: "ST15-",
    ST16: "ST16-",
    ST17: "ST17-",
    ST18: "ST18-",
    ST19: "ST19-",
    ST20: "ST20-"
  };

  /**
   * Método para obtener cartas mediante el atributo code.
   * @param codePrefix El prefijo del code (por ejemplo, "OP01-")
   * @param page Número de página
   * @param limit Número máximo de cartas por página
   */
  getCardsByCode(codePrefix: string, page: number, limit: number): Observable<{ totalPages: number; data: Card[] }> {
    return this.apiService.get<any>('cards', { code: codePrefix, page, limit }).pipe(
      map(response => ({
        totalPages: response.totalPages,
        data: response.data
      }))
    );
  }

  // Buscar cartas por nombre con paginación
  searchCards(name: string, page: number, limit: number): Observable<{ totalPages: number; data: Card[] }> {
    return this.apiService.get<any>('cards', { name, page, limit }).pipe(
      map(response => response)
    );
  }

  // Obtener todas las cartas (todas las páginas)
  // getAllCards(): Observable<Card[]> {
  //   const limit = 100; // Máximo permitido por la API
  //   // Primera petición (página 1)
  //   return this.apiService.get<any>('cards', { limit, page: 1 }).pipe(
  //     concatMap(response => {
  //       const totalPages = response.totalPages;
  //       const allData = response.data;
  //       const requests: Observable<Card[]>[] = [];

  //       // Crear peticiones para cada página a partir de la 2
  //       for (let page = 2; page <= totalPages; page++) {
  //         requests.push(
  //           this.apiService.get<any>('cards', { limit, page }).pipe(
  //             map(resp => resp.data)
  //           )
  //         );
  //       }
  //       // Si hay más páginas, combinar los resultados
  //       if (requests.length) {
  //         return forkJoin(requests).pipe(
  //           map(pagesData => allData.concat(...pagesData))
  //         );
  //       }
  //       // Si solo hay una página, devolver directamente
  //       return of(allData);
  //     })
  //   );
  // }

  // // Obtener detalles de una carta por ID
  // getCardById(cardId: string): Observable<Card> {
  //   return this.apiService.get<any>(`cards/${cardId}`);
  // }

  // // Obtener cartas por página
  // getCards(page: number, limit: number): Observable<{ totalPages: number; data: Card[] }> {
  //   return this.apiService.get<any>('cards', { page, limit }).pipe(
  //     map(response => ({ totalPages: response.totalPages, data: response.data }))
  //   );
  // }


}
