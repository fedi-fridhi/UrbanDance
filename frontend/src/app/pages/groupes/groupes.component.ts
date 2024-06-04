import { Component } from '@angular/core';
import { GroupesService } from '../../services/groupes.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../Models/user';
import { forkJoin, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-groupes',
  standalone: true,
  imports: [NgbPagination, CommonModule, FormsModule, RouterModule],
  providers: [GroupesService, UserService],
  templateUrl: './groupes.component.html',
  styleUrl: './groupes.component.css'
})
export class GroupesComponent {
  groupes: any[] = [];
  filteredGroupes: any[] = [];
  searchText: string = '';
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  type: string = '';
  user: User | null = null;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;

  constructor(private groupesService: GroupesService, private route: ActivatedRoute, private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type')!;
      this.groupesService.getAllGroupes().subscribe(response => {
        if (Array.isArray(response)) {
          const typedGroupes = response.filter(groupe => groupe.type === this.type);

          // Fetch coach names for each group
          const groupObservables = typedGroupes.map(groupe =>
            this.userService.getUserInfoById(groupe.coachid).pipe(
              map(coach => ({
                ...groupe,
                coachName: coach.name, 
                days: {
                  lundi: !!groupe.lundi,
                  mardi: !!groupe.mardi,
                  mercredi: !!groupe.mercredi,
                  jeudi: !!groupe.jeudi,
                  vendredi: !!groupe.vendredi,
                  samedi: !!groupe.samedi,
                  dimanche: !!groupe.dimanche,
                }
              }))
            )
            
          );

          // Execute all observables and update groups array once all completed
          forkJoin(groupObservables).subscribe(completedGroups => {
            this.groupes = completedGroups;
            this.totalRecords = this.groupes.length;
            this.applyFilter();
          });

        } else {
          console.error('getAllGroupes did not return a successful response with an array of groupes', response);
        }
      });
    });
  }

  applyFilter() {
    this.filteredGroupes = this.searchText ?
      this.groupes.filter(groupe => groupe.name.toLowerCase().includes(this.searchText.toLowerCase())) :
      this.groupes;
    this.totalRecords = this.filteredGroupes.length;
    this.paginateGroupes();
  }

  paginateGroupes() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredGroupes = this.filteredGroupes.slice(start, end);
  }

  onSearch() {
    this.applyFilter();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.paginateGroupes();
  }

  subscribeToGroup(id: any, userId: any) {
    this.groupesService.addInscription(id, userId).subscribe(response => {
      if (response && response.success) {
        console.log('Subscribed to group successfully', response);
        window.alert("Inscription avec success");
      } else {
        console.error('subscribeToGroup did not return a successful response', response);
        window.alert("Deja inscris dans ce groupe")
      }
    });
  }

}
