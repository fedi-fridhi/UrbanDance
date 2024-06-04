import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [UserService],
  templateUrl: './reset-request.component.html',
  styleUrl: './reset-request.component.css'
})
export class ResetRequestComponent {
  email?: string;
  message?: string;

  constructor(private userService: UserService, private router: Router) {}

  sendResetCode() {
    this.userService.sendResetCode(this.email ?? '').subscribe({
      next: (response) => {
        this.message = `Reset code has been sent to ${this.email}`;
        this.router.navigate(['verify-code']);
        window.alert(`Reset code has been sent to ${this.email}`);
      },
      error: (error) => {
        this.message = 'Failed to send reset code. Please try again later.';
      }
    });
  }

}
