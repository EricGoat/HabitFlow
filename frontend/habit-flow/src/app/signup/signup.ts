// Import Angular's component decorator
import { Component } from '@angular/core';

// Import Angular modules for forms and common directives
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Import Angular router
import { Router } from '@angular/router';

// Import the authentication service
import { AuthService } from '../services/auth.service';


// Handles user registration
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Stores validation errors
  errors: string[] = [];

  // Stores notification information
  notificationMessage: string = '';
  notificationType: string = '';

  // Display a temporary notification
  showNotification(message: string, type: string) {
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
    }, 3000);
  }

  // Validate the username
  isUsernameValid(username: string): boolean {
    return username.length >= 5 && !username.includes(' ');
  }

  // Validate the email address
  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate the password
  isPasswordValid(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    return passwordRegex.test(password) && !password.includes(' ');
  }

  // Verify that both passwords match
  doPasswordsMatch(
    password: string,
    confirmPassword: string
  ): boolean {
    return (
      confirmPassword.length > 0 &&
      password === confirmPassword
    );
  }

  // Submit the registration form
  onSubmit(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {

    // Clear previous validation errors
    this.errors = [];

    // Validate the username
    if (!this.isUsernameValid(username)) {
      this.errors.push(
        'Username must be at least 5 characters and contain no spaces.'
      );
    }

    // Validate the email
    if (!this.isEmailValid(email)) {
      this.errors.push(
        'Please enter a valid email.'
      );
    }

    // Validate the password
    if (!this.isPasswordValid(password)) {
      this.errors.push(
        'Password must contain an uppercase letter, a number, and no spaces.'
      );
    }

    // Verify that both passwords match
    if (!this.doPasswordsMatch(password, confirmPassword)) {
      this.errors.push(
        'Passwords do not match.'
      );
    }

    // Stop if any validation errors exist
    if (this.errors.length > 0) {
      this.showNotification(
        'Please fix the signup form errors.',
        'error'
      );
      return;
    }

    // Create the registration request object
    const userData = {
      username: username,
      email: email,
      password: password
    };

    // Send the registration request
    this.authService.register(userData).subscribe({

      // Display a success message and redirect to the login page
      next: () => {
        this.showNotification(
          'Account created successfully!',
          'success'
        );

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },

      // Display an error message if registration fails
      error: (error) => {
        console.error(error);

        if (error.error) {
          if (typeof error.error === 'string') {
            this.showNotification(error.error, 'error');
          } else if (error.error.username) {
            this.showNotification(error.error.username[0], 'error');
          } else if (error.error.email) {
            this.showNotification(error.error.email[0], 'error');
          } else if (error.error.password) {
            this.showNotification(error.error.password[0], 'error');
          } else {
            this.showNotification(
              'Signup failed. Please check your information.',
              'error'
            );
          }
        } else {
          this.showNotification(
            'Signup failed. Please try again.',
            'error'
          );
        }
      }

    });
  }
}