// Import Angular's component decorator
import { Component } from '@angular/core';

// Import Angular modules for forms and common directives
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Import Angular routing utilities
import { Router, RouterModule } from '@angular/router';

// Import the authentication service
import { AuthService } from '../services/auth.service';


// Handles user login
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  // Store the user's login credentials
  username: string = '';
  password: string = '';

  // Store the login response message
  response: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Authenticate the user and navigate to the dashboard
  login() {

    // Ensure both fields contain a value
    if (!this.username.trim() || !this.password.trim()) {
      this.response = 'Please enter your username and password.';
      return;
    }

    // Create the login request object
    const credentials = {
      username: this.username,
      password: this.password
    };

    // Send the login request to the backend
    this.authService.login(credentials).subscribe({

      // Save the authentication token and redirect on success
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        this.response = 'Login successful';
        this.router.navigate(['/dashboard']);
      },

      // Display an error message if login fails
      error: () => {
        this.response = 'Invalid username or password';
      }

    });
  }
}