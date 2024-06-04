import { Component } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupesService } from '../../services/groupes.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-grouplist',
  standalone: true,
  imports: [NgbPagination, FormsModule, CommonModule, HeaderComponent],
  providers: [GroupesService],
  templateUrl: './grouplist.component.html',
  styleUrl: './grouplist.component.css'
})
export class GrouplistComponent {
  groupes: any[] = [];
  filteredGroupes: any[] = [];
  searchText: string = '';
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';

  constructor(private groupesService: GroupesService, private router: Router) {}

  ngOnInit() {
    
    if (this.userRole !== 'Admin' && this.userRole !== 'Coach'){
        this.router.navigate(['/home']);
    }
    
    this.groupesService.getAllGroupes().subscribe(response => {
      if (Array.isArray(response)) {
        // Map through each groupe to convert days from 1/0 to true/false
        this.groupes = response.map(groupe => ({
          ...groupe,
          days: {
            lundi: !!groupe.lundi,
            mardi: !!groupe.mardi,
            mercredi: !!groupe.mercredi,
            jeudi: !!groupe.jeudi,
            vendredi: !!groupe.vendredi,
            samedi: !!groupe.samedi,
            dimanche: !!groupe.dimanche,
          }
        }));
        this.totalRecords = this.groupes.length;
        this.applyFilter();
      } else {
        console.error('getAllGroupes did not return a successful response with an array of groupes', response);
      }
    });
  }
  

  applyFilter() {
    this.currentPage = 1;
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

  deleteGroupe(id: any) {
    if (confirm('Are you sure you want to delete this groupe?')) {
      this.groupesService.deleteGroupe(id).subscribe(response => {
        if (response && response.success) {
          this.groupes = this.groupes.filter(groupe => groupe.id !== id);
          this.applyFilter();
        } else {
          console.error('deleteGroupe did not return a successful response', response);
        }
      });
    }
  }

  editGroupe(id: any) {
    this.router.navigate(['/updategroup', id]);
  }
  listStudents(id: any) {
    this.router.navigate(['/groupstudents', id]);
  }
}
