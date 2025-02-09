import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../core/card.service';
import { Card } from '../../models/card';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule],
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
      this.cardService.ebCode,
      ...Object.values(this.cardService.stCodes)
    ];
    this.loadCards();
  }

  ngAfterViewInit(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.loadCards();
        }
      },
      { root: null, threshold: 0.1 }
    );
    if (this.scrollTrigger) {
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

  // private sortCards(cards: Card[]): Card[] {
  //   const parseCardId = (id: string) => {
  //     // Se espera formato como "OP01-121" o "OP01-121_p1"
  //     const [prefix, rest] = id.split('-'); // Ej.: prefix = "OP01", rest = "121" o "121_p1"
  //     let cardNumberStr = '';
  //     let variantStr = '0';
  //     if (rest.includes('_p')) {
  //       [cardNumberStr, variantStr] = rest.split('_p');
  //     } else {
  //       cardNumberStr = rest;
  //     }
  //     return {
  //       prefix, // Ej.: "OP01"
  //       cardNumber: parseInt(cardNumberStr, 10),  // Ej.: 121
  //       variant: parseInt(variantStr, 10)         // 0 si no hay variante, 1 si es _p1, etc.
  //     };
  //   };

  //   return cards.sort((a, b) => {
  //     const aId = parseCardId(a.id);
  //     const bId = parseCardId(b.id);
  //     // Primero por el código de expansión
  //     if (aId.prefix !== bId.prefix) {
  //       return aId.prefix < bId.prefix ? -1 : 1;
  //     }
  //     // Luego por el número de carta
  //     if (aId.cardNumber !== bId.cardNumber) {
  //       return aId.cardNumber - bId.cardNumber;
  //     }
  //     // Por último, por la variante (0 antes que 1, etc.)
  //     return aId.variant - bId.variant;
  //   });
  // }
}
