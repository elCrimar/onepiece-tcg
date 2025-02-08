import { Component } from '@angular/core';
import { CardListComponent } from '../cards/card-list/card-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor() {
    console.log('HomeComponent initialized');
  }

}
