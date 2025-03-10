import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Deck } from '../models/deck';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  constructor(private apiService: ApiService) {}

  // Método para cargar decks por página
  getDecksByPage(page: number, limit: number): Observable<{ totalPages: number; data: Deck[] }> {
    return this.apiService.get<any>('decks', { page, limit }).pipe(
      map(response => ({
        totalPages: response.totalPages,
        data: response.data
      }))
    );
  }

  // Método para cargar un deck específico por ID
  getDeckById(id: string): Observable<Deck> {
    return this.apiService.get<Deck>(`decks/${id}`);
  }

  // Método para crear un nuevo deck (POST)
  createDeck(deck: Partial<Deck>): Observable<Deck> {
    return this.apiService.post<Deck>('decks', deck);
  }

  // Método para actualizar un deck existente (PUT)
  updateDeck(id: string, deck: Partial<Deck>): Observable<Deck> {
    return this.apiService.put<Deck>(`decks/${id}`, deck);
  }

  // Método para eliminar un deck (DELETE)
  deleteDeck(id: string): Observable<any> {
    return this.apiService.delete(`decks/${id}`);
  }
}
