import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-editevent',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbAlert,HeaderComponent],
  providers: [EventsService],
  templateUrl: './editevent.component.html',
  styleUrl: './editevent.component.css'
})
export class EditeventComponent {
  event = {
    id: null,
    name: '',
    description: '',
    price: null,
    bannersrc: '',
    e_date: '',    
    e_type: '',
    coachid: 0,
    coachName: '',
    localisation: '',
    limit_subs: null
  };
  alertMessage: string | null = null;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';

  constructor(private eventsService: EventsService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void { 
    if(this.userRole != 'Admin'){
      this.router.navigate(['/home']);
    }
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventsService.getEventById(eventId).subscribe(
        (response: any) => { // Use any or create an interface/type that matches the response structure
          if (response) {
            this.event = response; // Assuming the response structure has an 'event' field
          } else {
            // Handle the case where the event is not found or an error is returned
            console.error('No event found or an error occurred');
          }
        },
        error => {
          console.error('Error fetching event data', error);
        }
      );
    }
  }
  editEvent() {
    this.eventsService.updateEvent(this.event).subscribe({
      next: (response) => {
        console.log('Event edited successfully', response);
        window.alert("Event edited successfully!");
      },
      error: (error) => {
        console.error('There was an error!', error);
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
        .subscribe({
          next: (coachId) => {
            this.event.coachid = coachId;
          },
          error: (error) => {
            console.error('Error searching for coach:', error);
          }
        });
    }
  }


}
