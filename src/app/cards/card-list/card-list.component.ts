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

  @ViewChild('scrollTrigger') scrollTrigger!: ElementRef;
  private intersectionObserver!: IntersectionObserver;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
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
    if(this.scrollTrigger) {
      this.intersectionObserver.observe(this.scrollTrigger.nativeElement);
    }
  }

  loadCards(): void {
    if (this.loading || this.currentPage > this.totalPages) return;

    this.loading = true;
    this.cardService.getCards(this.currentPage, this.limit).subscribe({
      next: res => {
        this.totalPages = res.totalPages;
        this.cards = this.cards.concat(res.data);
        this.currentPage++;
        this.loading = false;
        // Reinicia la observación para seguir detectando el scroll
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
}
