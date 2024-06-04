import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost/api';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  
  constructor(private http: HttpClient, private userService : UserService) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup.php`, userData, { headers: this.headers })
      .pipe(
        tap((response: any) => {
          console.log('Response:', response);
          if (response.success && response.jwt) {
            localStorage.setItem('token', response.jwt);
            this.userService.loggedIn.next(true);
          }
        }),        
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  loginUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login.php`, userData, { headers: this.headers }).pipe(
      tap((response: any) => {
        console.log('Response:', response);
        if (response.success && response.jwt) {
          localStorage.setItem('token', response.jwt);
          this.userService.loggedIn.next(true);
        }
      }),      
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }


  
  
}
