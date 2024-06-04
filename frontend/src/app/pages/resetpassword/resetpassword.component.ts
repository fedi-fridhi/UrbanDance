import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [UserService],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {
  email?: string;
  newPassword?: string;
  message?: string;

  constructor(private userService: UserService, private router: Router) {}

  updatePassword() {
    if(this.email && this.newPassword) {
    this.userService.updatePassword(this.email, this.newPassword).subscribe({
      next: (response) => {
        this.message = 'Password updated successfully. You can now log in with your new password.';
        console.log('Password updated successfully', response);
        window.alert('Password updated successfully');
        this.router.navigate(['/auth']);

      },
      error: (error) => {
        this.message = 'Failed to update password. Please try again later.';
      }
    });
  }
  }

}
