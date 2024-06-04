import { Component } from '@angular/core';
import { GroupesService } from '../../services/groupes.service';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../pages/header/header.component';

@Component({
  selector: 'app-editgroup',
  standalone: true,
  imports: [FormsModule, NgbAlert, CommonModule,HeaderComponent],
  providers:[EventsService, GroupesService],
  templateUrl: './editgroup.component.html',
  styleUrl: './editgroup.component.css'
})
export class EditgroupComponent {
  groupe = {
    id:0,
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
    constructor(
      private groupesService: GroupesService,
      private eventsService: EventsService,
      private route: ActivatedRoute
    ) { }
    ngOnInit() {
      const groupeId =this.route.snapshot.paramMap.get('id');
        if (groupeId) {
          this.loadGroupData(groupeId);
        }
    }
  
    loadGroupData(id: any) {
      this.groupesService.getGroupeById(id).subscribe({
        next: (response: any) => {
          const days = {
            lundi: !!response.lundi,
            mardi: !!response.mardi,
            mercredi: !!response.mercredi,
            jeudi: !!response.jeudi,
            vendredi: !!response.vendredi,
            samedi: !!response.samedi,
            dimanche: !!response.dimanche,
          };
          
          this.groupe = response;
          this.groupe.days = days;
        },
        error: (error: any) => {
          console.error('Error loading the groupe:', error);
          this.alertMessage = 'Error loading the groupe.';
        }
      });
    }
    updateGroupe() {
      // Perform validation or other logic before attempting to update
      this.groupesService.updateGroupe(this.groupe).subscribe({
        next: (response) => {
          console.log('Groupe updated successfully', response);
          window.alert("Groupe updated successfully!");
          // Handle successful update, e.g., redirect or inform the user

        },
        error: (error) => {
          console.error('There was an error updating the groupe:', error);
          this.alertMessage = 'There was an error updating the groupe.';
        }
       
      });
    }
    searchCoach() {
      if (this.groupe.coachName.length > 5) {
        this.eventsService.searchCoachByName(this.groupe.coachName)
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
