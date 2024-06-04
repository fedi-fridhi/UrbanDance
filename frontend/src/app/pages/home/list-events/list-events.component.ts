import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../../services/events.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-list-events',
  standalone: true,
  imports: [DatePipe, FormsModule, CommonModule, NgbPaginationModule, NgbCarouselModule,HeaderComponent],
  providers: [EventsService, UserService],
  templateUrl: './list-events.component.html',
  styleUrl: './list-events.component.css'
})
export class ListEventsComponent implements OnInit{
  events: any[] = []; 
  eventGroups: any[][] = [];
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;


  constructor(private eventsService: EventsService, private userService: UserService) { }

  ngOnInit() {
    this.userId = parseInt(this.decodedJwt.data.id || '0');
    this.loadEvents();
  }

  loadEvents() {
    this.eventsService.getAllEvents().subscribe(data => {
      this.events = data;
  
      // Loop over the events array
      this.events.forEach((event, index) => {
        // Assume event.coach is the id of the coach
        this.userService.getUserInfoById(event.coachid).subscribe(
          (response: any) => { // Use any or create an interface/type that matches the response structure
            if (response.user) {
              this.events[index].coachName = response.user.name;
            }
          console.log('Event:', this.events[index]);
        });
      });
  
      this.groupEventsIntoThrees();
    });
  }
  subscribeEvent(eventId: number, userId: number) {
    
    this.eventsService.addSubscription(eventId, userId).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Subscribed to event successfully', response);
          window.alert('Subscribed to event successfully');
        } else {
          // Handle the case where the subscription was not successful even if the request was
          console.error('Subscription to the event failed:', response.message);
          window.alert(response.message || 'Subscription to the event failed. Please try again.');
        }
      },
      error: (error) => {
        const errorMessage = error.message || 'Failed to subscribe to the event. Please try again later.';
        console.error('There was an error subscribing to the event:', error);
      }
    });
    
  }
  groupEventsIntoThrees() {
    for (let i = 0; i < this.events.length; i += 3) {
      this.eventGroups.push(this.events.slice(i, i + 3));
    }
  }

}
