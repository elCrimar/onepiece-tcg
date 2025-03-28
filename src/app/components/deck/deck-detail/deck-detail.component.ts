import { Component, EventEmitter, Input, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deck } from '../../../models/deck';
import { Card } from '../../../models/card';
import { CardService } from '../../../services/card.service';
import { lastValueFrom } from 'rxjs';
import { CardDetailComponent } from '../../cards/card-detail/card-detail.component';

interface CardEntry {
  card: Card;
  quantity: number;
}

interface CardGroup {
  type: string;
  cards: CardEntry[];
}

@Component({
  selector: 'app-deck-detail',
  standalone: true,
  imports: [CommonModule, CardDetailComponent],
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeckDetailComponent implements OnInit {
  @Input() deck?: Deck;
  @Output() close = new EventEmitter<void>();
  
  hoveredCard: Card | null = null;
  groupedCards: CardGroup[] = [];
  selectedCard: Card | null = null;
  showCardDetail = false;

  // Añadir estas propiedades para la navegación
  allCards: Card[] = []; // Lista plana de todas las cartas (sin agrupación)
  currentCardIndex: number = -1;
  
  constructor(private cardService: CardService) {}
  
  ngOnInit(): void {
    if (this.deck) {
      this.loadCardsAndGroup();
    }
  }
  
  async loadCardsAndGroup(): Promise<void> {
    if (!this.deck || !this.deck.cards) return;
    
    const cardEntries: CardEntry[] = [];
    const cardPromises: Promise<void>[] = [];

    // Cargar los detalles de las cartas
    for (const [cardCode, quantity] of Object.entries(this.deck.cards)) {
      const promise = lastValueFrom(this.cardService.getCardByCode(cardCode))
        .then(card => {
          if (card) {
            console.log('Carta cargada:', card); // Depuración
            
            // Crear un objeto de carta normalizado con todos los campos necesarios
            const normalizedCard: Card = {
              id: card.id || cardCode,
              name: card.name || 'Carta sin nombre',
              code: card.code || cardCode,
              type: card.type || 'Otro',
              color: card.color || 'Desconocido',
              cost: card.cost || 0,
              power: card.power || 0,
              images: card.images, // Mantén el formato original de images
              rarity: card.rarity || 'Desconocido',
              // Arreglar la estructura de attribute
              attribute: typeof card.attribute === 'string'
                ? { name: card.attribute, image: '' }
                : card.attribute || { name: '', image: '' },
              counter: (card.counter !== undefined ? card.counter : 0).toString(),
              family: card.family || '',
              // Arreglar la estructura de ability en lugar de effect
              ability: (card as any).effect || card.ability || '',
              // Agregar trigger si existe o vacío
              trigger: card.trigger || ''
            };
            
            cardEntries.push({ card: normalizedCard, quantity });
          }
        })
        .catch(error => {
          console.error(`Error al cargar la carta con código ${cardCode}:`, error);
        });
        
      cardPromises.push(promise);
    }
    
    // Esperar a que todas las cartas se carguen
    await Promise.all(cardPromises);
    
    console.log('Cartas cargadas:', cardEntries.length); // Depuración
    
    // Agrupar las cartas una vez que tengamos todas
    this.groupCards(cardEntries);
  }
  
  groupCards(cardEntries: CardEntry[]): void {
    const groupsMap = new Map<string, CardEntry[]>();
    
    // Agrupar por tipo
    cardEntries.forEach(entry => {
      const type = entry.card.type || 'Otro';
      if (!groupsMap.has(type)) {
        groupsMap.set(type, []);
      }
      groupsMap.get(type)!.push(entry);
    });
    
    // Convertir el mapa a array y ordenar grupos
    this.groupedCards = Array.from(groupsMap.entries())
      .map(([type, cards]) => ({ type, cards }))
      .sort((a, b) => this.getTypeOrder(a.type) - this.getTypeOrder(b.type));
    
    // Ordenar cartas dentro de cada grupo
    this.groupedCards.forEach(group => {
      group.cards.sort((a, b) => {
        // Comprobar que ambas cartas tengan valores válidos para comparar
        const costA = a.card.cost !== undefined ? a.card.cost : 0;
        const costB = b.card.cost !== undefined ? b.card.cost : 0;
        
        // Primero ordenar por coste
        if (costA !== costB) return costA - costB;
        
        // Luego por nombre (asegurarse de que existen)
        const nameA = a.card.name || '';
        const nameB = b.card.name || '';
        return nameA.localeCompare(nameB);
      });
    });

    // Al final del método, después de organizar las cartas
    this.createFlatCardList();
  }

  // Método para inicializar la lista plana de cartas
  createFlatCardList(): void {
    this.allCards = [];
    // Crear una lista sin duplicados
    this.groupedCards.forEach(group => {
      group.cards.forEach(entry => {
        // Añadir cada carta solo una vez
        this.allCards.push(entry.card);
      });
    });
  }
  
  getTypeOrder(type: string): number {
    const orderMap: Record<string, number> = {
      'LEADER': 0,
      'CHARACTER': 1,
      'EVENT': 2,
      'STAGE': 3,
      'DON': 4,
      'Otro': 5
    };
    return orderMap[type] || 99;
  }
  
  getTotalInGroup(group: CardGroup): number {
    return group.cards.reduce((sum, entry) => sum + entry.quantity, 0);
  }
  
  setHoveredCard(card: Card): void {
    this.hoveredCard = card;
  }
  
  resetHoveredCard(): void {
    this.hoveredCard = null;
  }
  
  closeModal(): void {
    this.close.emit();
  }

  getImageUrl(card: Card): string {
    if (!card || !card.images) return '';
    
    // Si images es un string (URL directa)
    if (typeof card.images === 'string') {
      return card.images;
    }
    
    // Si es un objeto con small y large
    return card.images.large || card.images.small || '';
  }

  openCardDetail(card: Card): void {
    // Encontrar el índice de la carta en la lista plana
    this.currentCardIndex = this.allCards.findIndex(c => c.id === card.id);
    this.selectedCard = card;
    this.showCardDetail = true;
  }
  
  closeCardDetail(): void {
    this.showCardDetail = false;
    this.selectedCard = null;
  }

  // Método para navegar a la carta anterior
  goToPreviousCard(): void {
    if (this.allCards.length === 0) return;
    
    // Reducir el índice y volver al final si es necesario
    this.currentCardIndex = (this.currentCardIndex - 1 + this.allCards.length) % this.allCards.length;
    this.selectedCard = this.allCards[this.currentCardIndex];
  }
  
  // Método para navegar a la siguiente carta
  goToNextCard(): void {
    if (this.allCards.length === 0) return;
    
    // Aumentar el índice y volver al principio si es necesario
    this.currentCardIndex = (this.currentCardIndex + 1) % this.allCards.length;
    this.selectedCard = this.allCards[this.currentCardIndex];
  }
}
