import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [UserService],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent {
  email?: string;
  code?: string;
  message?: string;

  constructor(private userService: UserService, private router: Router) {}

  verifyCode() {
    if (this.email && this.code) {
      this.userService.verifyResetCode(this.email, this.code).subscribe({
        next: (response) => {
          this.message = 'Code verified successfully. Please reset your password.';
          this.router.navigate(['/reset-password']);
        },
        error: (error) => {
          this.message = 'Verification failed. Please check the code and try again.';
        }
      });
    }
  }

}
