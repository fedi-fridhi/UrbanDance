import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';
import { ɵBrowserAnimationBuilder } from '@angular/animations';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule,HeaderComponent],
  providers: [AuthService, Router, UserService],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  #authService = inject(AuthService);

  rightPanelActive = false;
  loginform = this.fb.group({
    loginemail: ['', [Validators.required, Validators.email]],
    loginpassword: ['', [Validators.required, Validators.minLength(6)]]
  });
  registerform = this.fb.group({
    registerEmail: ['', [Validators.required, Validators.email]],
    registerPassword: ['', [Validators.required, Validators.minLength(6)]],
    registerName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')]]
  });
  window: any;
  constructor(private fb:FormBuilder, private router: Router) {}
  get loginemail() { return this.loginform.get('loginemail'); }
  get loginpassword() { return this.loginform.get('loginpassword'); }
  get registerEmail() { return this.registerform.get('registerEmail'); }
  get registerPassword() { return this.registerform.get('registerPassword'); }
  get registerName() { return this.registerform.get('registerName'); }
  #userService = inject(UserService);

  toggleRightPanel(): void {
    this.rightPanelActive = !this.rightPanelActive;
  }
  submitLogin(): void {
    console.log(this.loginform.value);
    const postData = { email: this.loginform.value.loginemail, password: this.loginform.value.loginpassword };
    this.#authService.loginUser(postData as any).subscribe(
      (res: any) => {
        console.log(res);
        if (res.success && res.jwt) {
          window.alert("Logged in successfully!");
          this.#userService.loggedIn.next(true);
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
      
        }
      },
      (err) => {
        console.log(err);

      }
    );
  }
  
  submitRegister(): void {
    console.log(this.registerform.value);
    const postData = { name: this.registerform.value.registerName, email: this.registerform.value.registerEmail, password: this.registerform.value.registerPassword};
    this.#authService.registerUser(postData as any).subscribe(
      (res) => {
        
        window.alert("Account created successfully! Please login to continue.");
        console.log(res);
      },
      (err) => {
        
        console.log(err);
    });
  }
  

}

