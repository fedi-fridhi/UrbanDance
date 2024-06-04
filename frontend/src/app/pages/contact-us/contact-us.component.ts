import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FooterComponent,HeaderComponent, CommonModule, FormsModule],
  providers: [HttpClient],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  formData = {
    name: '',
    email: '',
    number: '',
    subject: '',
    message: ''
  };
  constructor(private http: HttpClient) {}
  submitForm() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: headers };

    this.http.post<any>('http://localhost/api/contact.php', this.formData, options)
      .subscribe(
        response => {
          console.log('Response:', response);
          if (response.success) {
            console.log('Form submission successful:', response.message);
            window.alert("Form submission successful!");
          } else {
            console.error('Form submission failed:', response.message);
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      number: '',
      subject: '',
      message: ''
    };
  }
}
