import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { CardListComponent } from './components/cards/card-list/card-list.component';
import { DeckListComponent } from './components/deck/deck-list/deck-list.component';
import { HomeComponent } from './home/home.component';
import { NewsListComponent } from './components/news/news-list/news-list.component';
import { NewsDetailComponent } from './components/news/news-detail/news-detail.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cards', component: CardListComponent },
  { path: 'decks', component: DeckListComponent },
  { path: 'news', component: NewsListComponent },
  { path: 'news/:id', component: NewsDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
