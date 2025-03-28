import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { DeckService } from '../../../services/deck.service';
import { Deck } from '../../../models/deck';
import { RouterModule } from '@angular/router';
import { DeckDetailComponent } from '../deck-detail/deck-detail.component';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, DeckDetailComponent],
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss']
})
export class DeckListComponent implements OnInit {
  decks: Deck[] = [];
  currentPage = 1;
  totalPages = 1;
  loading = false;
  selectedDeck?: Deck;
  showModal = false;

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.loadDecks();
  }

  loadDecks(): void {
    this.loading = true;
    this.deckService.getDecksByPage(this.currentPage, 12).subscribe({
      next: (response) => {
        this.decks = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los mazos', error);
        this.loading = false;
      }
    });
  }

  openDeckDetail(deck: Deck): void {
    console.log('Abriendo detalle del mazo:', deck);
    this.selectedDeck = deck;
    this.showModal = true;
  }

  closeDeckDetail(): void {
    this.showModal = false;
    this.selectedDeck = undefined;
  }
}
