import { Injectable, signal } from '@angular/core';
import { Observable, tap, map, catchError, throwError } from 'rxjs'; // Importar map, catchError, throwError
import { ApiService } from './api.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSignal = signal<Partial<User> | null>(this.getUserFromStorage()); // Usar Partial<User>
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = signal<boolean>(!!this.getUserFromStorage());

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  // Guarda solo la información del usuario (sin token)
  private saveAuthenticationState(userData: Partial<User>): void { // Aceptar Partial<User>, sin token
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.currentUserSignal.set(userData);
    this.isAuthenticated.set(true);
  }

  // Obtiene el usuario parcial desde localStorage
  private getUserFromStorage(): Partial<User> | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Limpia el estado de autenticación
  private clearAuthenticationState(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
    this.isAuthenticated.set(false);
  }

  // Método para el login de usuario
  login(credentials: any): Observable<Partial<User>> {
    return this.apiService.post<any>('login', credentials).pipe(
      map(response => {
        if (response && response.username && response.role) {
          const userData: Partial<User> = {
            username: response.username,
            role: response.role
            // id y created_at no están disponibles desde esta respuesta
          };
          this.saveAuthenticationState(userData);
          return userData;
        } else {
          console.error('Login response format unexpected:', response);
          throw new Error('Login failed: Invalid response format from API');
        }
      }),
      catchError(error => {
        console.error('Login API error:', error);
        return throwError(() => new Error(error.message || 'Login failed due to server error'));
      })
    );
  }

  // Método para el registro de usuario
  register(userData: any): Observable<User> {
    return this.apiService.post<User>('users', userData);
  }

  // Método para cerrar sesión
  logout(): void {
    this.clearAuthenticationState();
    this.router.navigate(['/login']);
  }
}
