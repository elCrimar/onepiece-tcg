import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
