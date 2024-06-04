import { Component, OnInit } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { User } from '../../Models/user';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../pages/header/header.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule, NgbPaginationModule, FormsModule,HeaderComponent],
  providers: [UserService],
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = []; // This will hold the filtered and paginated users.
  searchText: string = '';
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if(this.userRole != 'Admin'){
      this.router.navigate(['/home']);
    }
    this.userService.getAllUsersInfo().subscribe(response => {
      if (Array.isArray(response)) {
        this.users = response;
        this.totalRecords = this.users.length;
        this.applyFilter(); // Apply filter to paginate the initial set of data.
      } else {
        console.error('getAllUsersInfo did not return a successful response with an array of users', response);
      }
    });
  }

  applyFilter() {
    // Reset the current page to 1 if the search text changes.
    this.currentPage = 1;
    // Filtering the users array based on the search text.
    this.filteredUsers = this.searchText ?
      this.users.filter(user => user.name.toLowerCase().includes(this.searchText.toLowerCase()) || 
                                user.email.toLowerCase().includes(this.searchText.toLowerCase())) :
      this.users;
    // Update total records after filter.
    this.totalRecords = this.filteredUsers.length;
    // Paginate the filtered list.
    this.paginateUsers();
  }

  paginateUsers() {
    // Calculate the start index.
    const start = (this.currentPage - 1) * this.pageSize;
    // Calculate the end index.
    const end = start + this.pageSize;
    // Slice the filtered array for pagination.
    this.filteredUsers = this.filteredUsers.slice(start, end);
  }

  onSearch() {
    this.applyFilter();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.paginateUsers();
  }

  deleteUser(id: any) {
    this.userService.deleteUser(id).subscribe(() => {
      // Update the list without the deleted user.
      this.users = this.users.filter(user => user.id !== id);
      this.applyFilter(); // Reapply filters after deleting a user.
    });
  }

  editUser(id: any) {
    this.router.navigate(['/profile', id]);
  }
}
