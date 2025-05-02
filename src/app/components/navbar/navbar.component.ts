import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faBook, faLayerGroup, faNewspaper, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  faHome = faHome;
  faBook = faBook;
  faLayerGroup = faLayerGroup;
  faNewspaper = faNewspaper;
  faUser = faUser;
  faXmark = faXmark;
  
  isMobileMenuOpen = false;
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Inyectar servicio de autenticación
  private authService = inject(AuthenticationService);

  // Usar las señales directamente desde el servicio
  isAuthenticated = this.authService.isAuthenticated;

  // Señal computada para obtener el nombre de usuario de forma segura
  username = computed(() => this.authService.currentUser()?.username);

  // Método para llamar al logout del servicio
  logout(): void {
    this.authService.logout();
  }
}
