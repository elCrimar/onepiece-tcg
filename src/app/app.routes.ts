import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { CardListComponent } from './components/cards/card-list/card-list.component';
import { DeckListComponent } from './components/deck/deck-list/deck-list.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cartas', component: CardListComponent },
  { path: 'decks', component: DeckListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
