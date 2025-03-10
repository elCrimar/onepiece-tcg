import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../services/card.service';
import { Card } from '../../../models/card';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { CardDetailComponent } from '../card-detail/card-detail.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Añadir esta importación
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'; // Añadir esta importación

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, CardDetailComponent, NavbarComponent, FontAwesomeModule], // Añadir FontAwesomeModule
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, AfterViewInit {
  // Añadir el icono
  faCircleExclamation = faCircleExclamation;
  
  displayedCards: Card[] = []; // Cartas que se muestran actualmente
  currentPage = 1;
  limit = 36;
  totalPages = 1;
  loading = false;

  showModal = false;
  selectedCard?: Card;
  
  // Modo búsqueda y filtros
  searchMode: boolean = false;
  searchFilters: any = {};

  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private intersectionObserver!: IntersectionObserver;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.loadInitialCards();
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && this.scrollTrigger) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !this.loading) {
            if (this.searchMode) {
              this.loadSearchCards();
            } else {
              this.loadMoreCards();
            }
          }
        },
        { root: null, threshold: 0.1 }
      );
      this.intersectionObserver.observe(this.scrollTrigger.nativeElement);
    }
  }

  loadInitialCards(): void {
    if (this.loading) return;
    
    // NO establecemos loading en true aquí, porque luego llamamos a loadMoreCards
    this.displayedCards = [];
    this.currentPage = 1;
    
    // Cargamos la primera página directamente, que ya se encargará de establecer loading = true
    this.loadMoreCards();
  }

  loadMoreCards(): void {
    if (this.loading) return;
    // Aquí está el cambio: eliminar la condición especial para totalPages === 1
    if (this.currentPage > this.totalPages) return;

    // Aquí es donde realmente cambiamos a loading = true
    this.loading = true;
    console.log(`Solicitando página ${this.currentPage} de tarjetas`);
    
    this.cardService.getCardsByPage(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.totalPages = response.totalPages;
        
        // Añadir verificación para manejar respuestas vacías
        if (!response.data || response.data.length === 0) {
          console.log('No hay más cartas para mostrar');
          this.currentPage = this.totalPages + 1; // Aseguramos que no se hagan más peticiones
        } else {
          this.displayedCards = [...this.displayedCards, ...response.data];
          this.currentPage++;
          console.log(`Mostrando cartas página ${this.currentPage-1} de ${this.totalPages}`);
        }
        
        this.loading = false;
        
        // Reobservar para el scroll infinito
        if (this.intersectionObserver && this.scrollTrigger) {
          setTimeout(() => {
            this.intersectionObserver.unobserve(this.scrollTrigger.nativeElement);
            this.intersectionObserver.observe(this.scrollTrigger.nativeElement);
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error al cargar cartas:', err);
        this.loading = false;
      }
    });
  }

  loadSearchCards(): void {
    if (this.loading) return;
    if (this.currentPage > this.totalPages) return;

    this.loading = true;
    console.log(`Solicitando búsqueda página ${this.currentPage}`);
    
    this.cardService.searchCards(this.searchFilters, this.currentPage, this.limit).subscribe({
      next: res => {
        this.totalPages = res.totalPages;
        
        // Si no se encontraron cartas y es la primera página, se mostrará el mensaje
        if(this.currentPage === 1 && res.data.length === 0){
          this.displayedCards = [];
          // Importante: asegurarnos de que no se hagan más peticiones
          this.currentPage = 2; // Para evitar más cargas
          this.totalPages = 1; // Solo hay una página (vacía)
          console.log('Búsqueda sin resultados');
        } 
        // Añadir verificación para manejar respuestas vacías en páginas posteriores
        else if (res.data.length === 0) {
          console.log('No hay más cartas para mostrar');
          this.currentPage = this.totalPages + 1; // Aseguramos que no se hagan más peticiones
        }
        else {
          this.displayedCards = this.displayedCards.concat(res.data);
          this.currentPage++;
        }
        
        this.loading = false;
        if (this.intersectionObserver && this.scrollTrigger) {
          setTimeout(() => {
            this.intersectionObserver.unobserve(this.scrollTrigger.nativeElement);
            this.intersectionObserver.observe(this.scrollTrigger.nativeElement);
          }, 100);
        }
      },
      error: err => {
        console.error('Error al buscar cartas:', err);
        this.loading = false;
      }
    });
  }

  onSearch(searchData: any): void {
    if (!searchData.name && !Object.values(searchData).some(val => val)) {
      // Se desactiva el modo búsqueda y se restablece la lista original
      this.searchMode = false;
      this.displayedCards = [];
      this.currentPage = 1;
      
      // Volvemos a cargar la primera página
      this.loadMoreCards();
      return;
    }

    this.searchMode = true;
    this.searchFilters = { ...searchData };
    this.displayedCards = [];
    this.currentPage = 1;
    this.loadSearchCards();
  }

  openModal(card: Card): void {
    this.selectedCard = card;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCard = undefined;
  }
  
  previousCard(): void {
    if (!this.selectedCard || this.displayedCards.length === 0) return;
    const currentIndex = this.displayedCards.findIndex(c => c.id === this.selectedCard!.id);
    if (currentIndex > 0) {
      this.selectedCard = this.displayedCards[currentIndex - 1];
    }
  }

  nextCard(): void {
    if (!this.selectedCard || this.displayedCards.length === 0) return;
    const currentIndex = this.displayedCards.findIndex(c => c.id === this.selectedCard!.id);
    if (currentIndex >= 0 && currentIndex < this.displayedCards.length - 1) {
      this.selectedCard = this.displayedCards[currentIndex + 1];
    }
  }
}
