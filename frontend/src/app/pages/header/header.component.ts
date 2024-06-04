import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [UserService, HttpClient],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  #userService = inject(UserService);
  private subscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;
  jwt: any = localStorage.getItem('token');
  decodedJwt: any = this.jwt ? jwtDecode(this.jwt) as { data: { id: number } } : null;
  userId: number = this.decodedJwt?.data.id || 0;
  userRole: string = this.decodedJwt?.data.role || 'User';

  constructor(private userService: UserService,private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscription = this.userService.isLoggedInObservable.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        this.cd.detectChanges();
        this.userId = parseInt(this.decodedJwt.data.id || '0');
        console.log(this.decodedJwt)
      }
    );
    this.checkScroll();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll(): void {
    const navigation = document.querySelector('.navigation');
    if (navigation) {
      if (window.scrollY > 100) {
        navigation.classList.add('fixed-nav');
      } else {
        navigation.classList.remove('fixed-nav');
      }
    }
  }


  onLogout(): void {
    this.#userService.logout();
  }

}
