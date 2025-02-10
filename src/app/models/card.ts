export interface Card {
  id: string;
  code: string;
  rarity: string;
  type: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  cost?: number;
  attribute: {
    image: string;
  };
  power: number;
  counter: string;
  color: string;
  family: string;
  ability: string;
  trigger: string;
  set?: {
    name: string;
  };
  notes?: string[];
}
