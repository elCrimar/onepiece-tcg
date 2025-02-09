import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../core/card.service';
import { Card } from '../../models/card';
import { SearchBarComponent } from '../../search/search-bar/search-bar.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, SearchBarComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, AfterViewInit {
  cards: Card[] = [];
  currentPage = 1;
  limit = 36;
  totalPages = 1;
  loading = false;

  currentExpansionIndex = 0;
  expansionCodes!: string[];
  
  // Agregamos las propiedades para el modo búsqueda
  searchMode: boolean = false;
  searchQuery: string = '';

  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private intersectionObserver!: IntersectionObserver;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    // Inicializamos expansionCodes una vez que ya tenemos cardService
    this.expansionCodes = [
      this.cardService.opCodes.OP01,
      this.cardService.opCodes.OP02,
      this.cardService.opCodes.OP03,
      this.cardService.opCodes.OP04,
      this.cardService.opCodes.OP05,
      this.cardService.opCodes.OP06,
      this.cardService.opCodes.OP07,
      this.cardService.opCodes.OP08,
      this.cardService.opCodes.OP09,
      this.cardService.ebCode,
      ...Object.values(this.cardService.stCodes)
    ];
    this.loadCards();
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window && this.scrollTrigger) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (this.searchMode) {
              this.loadSearchCards();
            } else {
              this.loadCards();
            }
          }
        },
        { root: null, threshold: 0.1 }
      );
      this.intersectionObserver.observe(this.scrollTrigger.nativeElement);
    }
  }

  loadCards(): void {
    if (this.loading) return;
    if (this.currentExpansionIndex >= this.expansionCodes.length) return; // No hay más expansiones

    this.loading = true;
    const codePrefix = this.expansionCodes[this.currentExpansionIndex];

    this.cardService.getCardsByCode(codePrefix, this.currentPage, this.limit).subscribe({
      next: res => {
        this.totalPages = res.totalPages;

        // Si no hay cartas en esta página o se ha superado la paginación para esta expansión
        if (res.data.length === 0 || this.currentPage > this.totalPages) {
          // Cambiar al siguiente código de expansión
          this.currentExpansionIndex++;
          this.currentPage = 1;
          this.loading = false;
          this.loadCards();
          return;
        }

        // Concatenamos las cartas nuevas y aplicamos sortCards
        this.cards = this.cards.concat(res.data);
        this.currentPage++;
        this.loading = false;
        if (this.intersectionObserver && this.scrollTrigger) {
          this.intersectionObserver.unobserve(this.scrollTrigger.nativeElement);
          this.intersectionObserver.observe(this.scrollTrigger.nativeElement);
        }
      },
      error: err => {
        console.error('Error al obtener las cartas:', err);
        this.loading = false;
      }
    });
  }

  // Método para cargar cartas de búsqueda paginadas
  loadSearchCards(): void {
    if (this.loading) return;
    if (this.currentPage > this.totalPages) return; // No hay más páginas en la búsqueda

    this.loading = true;
    this.cardService.searchCards(this.searchQuery, this.currentPage, this.limit).subscribe({
      next: res => {
        this.totalPages = res.totalPages;
        // Se concatenan los resultados de la búsqueda
        this.cards = this.cards.concat(res.data);
        this.currentPage++;
        this.loading = false;
        if (this.intersectionObserver && this.scrollTrigger) {
          this.intersectionObserver.unobserve(this.scrollTrigger.nativeElement);
          this.intersectionObserver.observe(this.scrollTrigger.nativeElement);
        }
      },
      error: err => {
        console.error('Error al buscar cartas:', err);
        this.loading = false;
      }
    });
  }

  // Método para iniciar la búsqueda o restablecer la lista
  onSearch(query: string): void {
    if (!query) {
      // Se desactiva el modo búsqueda y se restablece la lista original
      this.searchMode = false;
      this.cards = [];
      this.currentExpansionIndex = 0;
      this.currentPage = 1;
      this.loadCards();
      return;
    }

    // Activa el modo búsqueda y reinicia la paginación para consultas
    this.searchMode = true;
    this.searchQuery = query;
    this.cards = [];
    this.currentPage = 1;
    this.loadSearchCards();
  }
}
