import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api/api/one-piece';
  private apiKey = 'd3a2475eeb6759c8a508c8a5d91b028e5fcd4ab54d1030f3f8a4e5db5e57ad2b'; // ⚠️ Mejor almacenarlo en enviroments.ts

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': this.apiKey
    });
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(),
      params
    });
  }
}
