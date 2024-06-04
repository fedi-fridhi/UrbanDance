import { Component } from '@angular/core';
import { GroupesService } from '../../services/groupes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { EventsService } from '../../services/events.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ajoutgroup',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbAlert, HttpClientModule],
  providers: [GroupesService, EventsService],
  templateUrl: './ajoutgroup.component.html',
  styleUrl: './ajoutgroup.component.css'
})
export class AjoutgroupComponent {
  groupe = {
    name: '',
    type: '',
    coachid: null,
    coachName: '',
    price: null,
    nbr_limit: null,
    days: {
      lundi: false,
      mardi: false,
      mercredi: false,
      jeudi: false,
      vendredi: false,
      samedi: false,
      dimanche: false
    } as { [key: string]: boolean }, // Define days with an index signature
    horaire_debut: '',
    horaire_fin: ''
  };
    alertMessage: string | null = null;
    jwt: any = localStorage.getItem('token');
    decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
    userId: number = this.decodedJwt?.data.id || 0;
    userRole: string = this.decodedJwt?.data.role || 'User';
  
    constructor(private groupesService: GroupesService, private eventService: EventsService, private router: Router) { }
  
    ngOnInit() {
      if (this.userRole !== 'Admin' && this.userRole !== 'Coach'){
        this.router.navigate(['/home']);
    }
    }
  
    addGroupe() {
      if (this.alertMessage) {
        console.error(this.alertMessage);
        return;
      }
  
      this.groupesService.createGroupe(this.groupe).subscribe({
        next: (response) => {
          console.log('Groupe added successfully', response);
          window.alert("Groupe added successfully!");
        },
        error: (error) => {
          console.error('There was an error adding the groupe:', error);
        }
      });
    }
    searchCoach() {
      if (this.groupe.coachName.length > 5) {
        this.eventService.searchCoachByName(this.groupe.coachName)
          .subscribe((coachId: any) => {
            if (coachId) {
              this.groupe.coachid = coachId;
              this.alertMessage = null; // Clear any previous alerts
            } else {
              // Set an alert message if no coach is found or the user is not a coach
              this.alertMessage = 'No coach found with that name or user is not a coach';
            }
          }, (error: any) => {
            console.error('Error searching for coach:', error);
            this.alertMessage = 'An error occurred while searching for the coach.';
          });
      } else {
        // Optionally handle the case where the input is too short
        this.alertMessage = 'Please enter at least 6 characters to search for a coach.';
      }
    }

    
  
}
