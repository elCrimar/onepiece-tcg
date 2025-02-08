import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api/api/one-piece';
  private apiKey = '296d2b7ea7ab3b186a82ff74725b316a6166b629a3abd4c66466a11a41e014b6'; // ⚠️ Mejor almacenarlo en enviroments.ts

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
