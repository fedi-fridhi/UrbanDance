import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports:[RouterLink,AboutComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',

})
export class FooterComponent {

}
