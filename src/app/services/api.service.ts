import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private baseUrl = '/api/api/one-piece';
  // private apiKey = environment.apiKey;
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // private getHeaders(): HttpHeaders {
  //   return new HttpHeaders({
  //     'x-api-key': this.apiKey
  //   });
  // }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(),
      params
    });
  }
}
