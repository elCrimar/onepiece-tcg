import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { CardListComponent } from './components/cards/card-list/card-list.component';
import { CardDetailComponent } from './components/cards/card-detail/card-detail.component';
import { DeckBuilderComponent } from './components/deck/deck-builder/deck-builder.component';
import { DeckListComponent } from './components/deck/deck-list/deck-list.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cards', component: CardListComponent },
  { path: 'cards/:id', component: CardDetailComponent },
  { path: 'decks', component: DeckListComponent },
  { path: 'deck-builder', component: DeckBuilderComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
