import { Component, OnInit } from '@angular/core';
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
export class CardListComponent implements OnInit {
  cards: Card[] = [];

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cardService.getAllCards().subscribe({
      next: (cards: Card[]) => {
        console.log('Cartas:', cards);
        this.cards = cards;
      },
      error: (err) => console.error('Error al obtener las cartas:', err)
    });
  }
}
