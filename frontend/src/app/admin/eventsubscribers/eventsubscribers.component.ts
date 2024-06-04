import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-eventsubscribers',
  standalone: true,
  imports: [NgbPagination, FormsModule, CommonModule,HeaderComponent],
  providers: [EventsService],
  templateUrl: './eventsubscribers.component.html',
  styleUrls: ['./eventsubscribers.component.css']
})
export class EventSubscribersComponent implements OnInit {
  subscribers: any[] = [];
  filteredSubscribers: any[] = [];
  searchText: string = '';
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  eventId: number = 0;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';

  constructor(private eventsService: EventsService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  
      if(this.userRole != 'Admin'){
        this.router.navigate(['/home']);
    }
    
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.loadSubscribers();
    });
  }

  loadSubscribers() {
    this.eventsService.getEventSubscribers(this.eventId).subscribe(response => {
      if (Array.isArray(response)) {
        this.subscribers = response;
        this.totalRecords = this.subscribers.length;
        this.applyFilter();
      } else {
        console.error('getEventSubscribers did not return a successful response with an array of subscribers', response);
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.filteredSubscribers = this.searchText ?
      this.subscribers.filter(sub => sub.name.toLowerCase().includes(this.searchText.toLowerCase())) :
      this.subscribers;
    this.totalRecords = this.filteredSubscribers.length;
    this.paginateSubscribers();
  }

  paginateSubscribers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredSubscribers = this.filteredSubscribers.slice(start, end);
  }

  onSearch() {
    this.applyFilter();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.paginateSubscribers();
  }
}
