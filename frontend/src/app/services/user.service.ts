// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, delay, take, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost/api';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private router : Router) { }


  public loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  get isLoggedInObservable(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }


  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
    window.location.reload();
    this.loggedIn.next(false);
  }
  
  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  getUserInfoById(userId: string): Observable<User> {
    const body = { id: userId }; // Construct the request body
    return this.http.post<User>(`${this.baseUrl}/getUserInfoById.php`, body, { headers: this.getAuthHeaders() })
      .pipe(catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }));
  }

  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post('http://localhost/api/upload_picture.php', formData);
  }
  

  getAllUsersInfo(): Observable<User[]> {
    return this.http.post<User[]>(`${this.baseUrl}/userlist.php`, { headers: this.getAuthHeaders() })
      .pipe(catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }));
  }

  // Add method to update user info
  updateUserInfo(user: User): Observable<User> {
    console.log('Updating user info:', user);
    return this.http.post<User>(`${this.baseUrl}/UpdateUserInfo.php`, user, { headers: this.getAuthHeaders() })
      .pipe(catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }));
  }
  getUserRoleById(userId: string): Observable<{ role: string }> {
    const userData = { userId };
    return this.http.post<{ role: string }>(`${this.baseUrl}/getUserRoleById.php`, userData, { headers: this.getAuthHeaders() })
      .pipe(catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }));
  }
  deleteUser(id: number): Observable<{}> {
    const url = `${this.baseUrl}/deleteuser.php`;
    const options = {
      headers: this.headers,
      body: { id }
    };
    return this.http.request('delete', url, options);
  }
  sendResetCode(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send_reset_code.php`, { email }, { headers: this.headers })
      .pipe(catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }));
  }

  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify_reset_code.php`, { email, code }, { headers: this.headers })
      .pipe(catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }));
  }

  updatePassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_password.php`, { email, newPassword }, { headers: this.headers })
      .pipe(catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }));
  }
}
