import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../Models/user';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { GroupesService } from '../../services/groupes.service';
import { EventsService } from '../../services/events.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [FormsModule, CommonModule,HeaderComponent, DatePipe],
  providers: [UserService, GroupesService, EventsService]
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: 0,
    name: '',
    phone: '',
    email: '',
    role: 'User',
    address: 'Not provided',
    country: 'Tunisia',
    region: 'Tunis',
    codepostal: '0000',
    picturesrc: 'assets/profile.jpg'
  };
  groupSubscriptions: any[] = [];
  eventSubscriptions: any[] = [];
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private groupService: GroupesService,
    private eventService: EventsService,
    private router: Router

  ) {}
  saveProfile(): void {
    this.userService.updateUserInfo(this.user).subscribe(
      updatedUser => {
        console.log('User info updated:', updatedUser);
        window.alert("Saved successfully!");
        // handle successful update here
      },
      error => {
        console.error('Error updating user info:', error);
        // handle error here
      }
    );
  }
  ngOnInit(): void {
    const userIdd = this.route.snapshot.paramMap.get('id');
    const userId = parseInt(this.route.snapshot.paramMap.get('id') ?? '', 10);
    if(this.userId == userId || this.userRole == 'Admin'){
    
    if (userIdd) {
      this.userService.getUserInfoById(userIdd).subscribe(
        (response: any) => { // Use any or create an interface/type that matches the response structure
          if (response.user) {
            this.user = response.user; // Assuming the response structure has a 'user' field
          } else {
            // Handle the case where the user is not found or an error is returned
            console.error('No user found or an error occurred', response.message);
          }
        },
        error => {
          console.error('Error fetching user data', error);
        }
      );
      this.loadSubscriptions();
    }
  }
  else{
    this.router.navigate(['/home']);
  }
  }
  handleFileInput(event: any): void {
    const file = event.target.files[0];
    const userId = this.route.snapshot.paramMap.get('id');
    if (file) {
      const formData = new FormData();
      formData.append('picture', file);
      if (userId) {
        formData.append('pictureName', userId.toString());
      }

      this.userService.uploadProfilePicture(formData).subscribe({
        next: (response) => {
          this.user.picturesrc = `http://localhost/api/${response.pictureSrc}` // Update the local user profile picture path
          console.log('Profile picture updated successfully');
          console.log('New picture path:', response);
          this.saveProfile();
        },
        error: (error) => {
          console.error('Failed to upload profile picture', error);
        }
      });
    }
  }
  loadSubscriptions() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
        this.groupService.mySubscriptions(+userId).subscribe(data => {
            this.groupSubscriptions = data;
        });

        this.eventService.listMyEvents(+userId).subscribe(data => {
            this.eventSubscriptions = data;
        });
    }
}
}
