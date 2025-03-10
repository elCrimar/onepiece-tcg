export interface Deck {
  id: string;
  name: string;
  description: string;
  leader: {
    id: string;
    name: string;
    color: string;
    type: string;
    images: {
      small: string;
      large: string;
    };
  };
  cards: { [cardId: string]: number }; // Mapa de cardId -> cantidad
  total_cards: number;
}