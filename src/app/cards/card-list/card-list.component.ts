import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Card } from '../../models/card';  // Asegúrate de que la ruta sea la correcta
import { CardService } from '../../core/card.service';  // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  cards: Card[] = [];
  filteredCards: Card[] = [];
  searchTerm: string = '';

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    // Supone que el servicio retorna un observable de cartas
    this.cardService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards;
        this.filteredCards = cards;
      },
      error: (err) => console.error('Error al obtener cartas:', err)
    });
  }

  onSearchChange(): void {
    // Filtra las cartas por el nombre (o puedes extender la lógica de búsqueda)
    this.filteredCards = this.cards.filter(card =>
      card.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
