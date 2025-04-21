import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faBook, faLayerGroup, faNewspaper, faUser } from '@fortawesome/free-solid-svg-icons';

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
  
  isMobileMenuOpen = false;
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
