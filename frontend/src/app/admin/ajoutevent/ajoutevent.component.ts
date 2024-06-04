import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../../pages/header/header.component';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';



@Component({
  selector: 'app-ajoutevent',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbAlert,HeaderComponent],
  providers: [EventsService],
  templateUrl: './ajoutevent.component.html',
  styleUrl: './ajoutevent.component.css'
})
export class AjouteventComponent {
  event = {
    name: '',
    description: '',
    price: null,
    bannersrc: '',
    e_date: '',    
    e_type: '',
    coachid: 0, // Initially null, will be set to a number upon selection
    localisation: '', // New field for localisation
    limit_subs: null, // New field for limit_subs
    coachName: ''
  };
  alertMessage: string | null = null;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';


  constructor(private eventsService: EventsService, private router:Router) { }

  ngOnInit() {
    if(this.userRole != 'Admin'){
      this.router.navigate(['/home']);
  }
  }



  addEvent() {
    
    if (this.alertMessage) {
      console.error(this.alertMessage);
      return;
    }

    this.eventsService.addEvent(this.event).subscribe({
      next: (response) => {
        console.log('Event added successfully', response);
        window.alert("Event added successfully!");
        
      },
      error: (error) => {
        console.error('There was an error adding the event:', error);
      }
    });
  }

  onFileSelect(event: Event) {
    const element = event.target as HTMLInputElement;
    let file: File | null = element.files ? element.files[0] : null;

    if (file) {
        this.eventsService.uploadBanner(file).subscribe({
            next: (response) => {
                this.event.bannersrc = response.bannerSrc;
            },
            error: (error) => {
                console.error('Upload error:', error.error.message); // Log or display more detailed error
            }
        });
    } else {
        console.error('No file selected!');
    }
  }
  searchCoach() {
    if (this.event.coachName.length > 5) {
      this.eventsService.searchCoachByName(this.event.coachName)
        .subscribe(coachId => {
          if (coachId) {
            this.event.coachid = coachId;
            this.alertMessage = null; // Clear any previous alerts
          } else {
            // Set an alert message if no coach is found or the user is not a coach
            this.alertMessage = 'No coach found with that name or user is not a coach';
          }
        }, error => {
          console.error('Error searching for coach:', error);
          this.alertMessage = 'An error occurred while searching for the coach.';
        });
    } else {
      // Optionally handle the case where the input is too short
      this.alertMessage = 'Please enter at least 6 characters to search for a coach.';
    }
  }
}
