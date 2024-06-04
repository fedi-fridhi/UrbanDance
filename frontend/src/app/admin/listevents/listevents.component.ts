import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-listevents',
  standalone: true,
  imports: [NgbPagination, FormsModule, CommonModule,HeaderComponent],
  providers: [EventsService],
  templateUrl: './listevents.component.html',
  styleUrl: './listevents.component.css'
})
export class ListeventsComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  searchText: string = '';
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit() {
      if(this.userRole != 'Admin'){
        this.router.navigate(['/home']);
    }

    this.eventsService.getAllEvents().subscribe(response => {
      if (Array.isArray(response)) {
        this.events = response;
        this.totalRecords = this.events.length;
        this.applyFilter();
      } else {
        console.error('getAllEvents did not return a successful response with an array of events', response);
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.filteredEvents = this.searchText ?
      this.events.filter(event => event.title.toLowerCase().includes(this.searchText.toLowerCase()) || 
                                  event.description.toLowerCase().includes(this.searchText.toLowerCase())) :
      this.events;
    this.totalRecords = this.filteredEvents.length;
    this.paginateEvents();
  }

  paginateEvents() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredEvents = this.filteredEvents.slice(start, end);
  }
  onSearch() {
    this.applyFilter();
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.paginateEvents();
  }
  deleteEvent(id: any) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventsService.deleteEvent(id).subscribe(response => {
        if (response && response.success) {
          this.events = this.events.filter(event => event.id !== id);
          this.applyFilter();
        } else {
          console.error('deleteEvent did not return a successful response', response);
        }
      });
    }
  }
  editEvent(id: any) {
    this.router.navigate(['/editevent', id]);
  }
  viewSubscribers(id: any) {
    this.router.navigate(['/eventsubscribers', id]);
  }

}
