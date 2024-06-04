import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ListEventsComponent } from './list-events/list-events.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ HeaderComponent,FooterComponent,ListEventsComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private router: Router) { }
  urbandance(){
    this.router.navigate(['/groupes','URBANDANCE']);
  }
  parkour(){
    this.router.navigate(['/groupes','PARKOUR']);
  }
  flex(){
    this.router.navigate(['/groupes','FLEX']);
  }

}
