import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role: 'Admin' | 'Member' | 'TeamLead' = 'Member';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const success = this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role });
    if (success) {
      alert('Registration successful!');
      this.router.navigate(['/login']);
    } else {
      alert('User already exists!');
    }
  }
}
