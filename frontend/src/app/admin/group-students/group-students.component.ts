import { Component } from '@angular/core';
import { GroupesService } from '../../services/groupes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-group-students',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbPagination],
  providers: [GroupesService],
  templateUrl: './group-students.component.html',
  styleUrl: './group-students.component.css'
})
export class GroupStudentsComponent {
  students: any[] = [];
  filteredStudents: any[] = [];
  searchText: string = '';
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  groupId: number = 0;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';

  constructor(private groupesService: GroupesService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {

      if(this.userRole != 'Admin'){
        this.router.navigate(['/home']);
    }
    
    this.route.params.subscribe(params => {
      this.groupId = params['id'];
      console.log('Group ID:', this.groupId);
      this.loadStudents();
    });
  }

  loadStudents() {
    this.groupesService.groupeStudents(this.groupId).subscribe(response => {
      if (Array.isArray(response)) {
        this.students = response;
        this.totalRecords = this.students.length;
        this.applyFilter();
      } else {
        console.error('getGroupStudents did not return a successful response with an array of students', response);
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.filteredStudents = this.searchText ?
      this.students.filter(student => student.name.toLowerCase().includes(this.searchText.toLowerCase())) :
      this.students;
    this.totalRecords = this.filteredStudents.length;
    this.paginateStudents();
  }

  paginateStudents() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredStudents = this.filteredStudents.slice(start, end);
  }

  onSearch() {
    this.applyFilter();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.paginateStudents();
  }
}
