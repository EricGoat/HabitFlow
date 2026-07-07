// Import Angular core functionality
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// Import common Angular directives
import { CommonModule } from '@angular/common';

// Import support for two-way data binding
import { FormsModule } from '@angular/forms';

// Import Angular router
import { Router } from '@angular/router';

// Import the authentication service
import { AuthService } from '../services/auth.service';


// Define the Profile component
@Component({

  // HTML selector for the component
  selector: 'app-profile',

  // Configure as a standalone component
  standalone: true,

  // Import required Angular modules
  imports: [CommonModule, FormsModule],

  // Link the HTML template
  templateUrl: './profile.html',

  // Link the CSS stylesheet
  styleUrl: './profile.css'

})

// Profile page component
export class ProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  // Store the current username shown to the user
  currentUsername = '';

  // Store the current email shown to the user
  currentEmail = '';

  // Store the editable username
  username = '';

  // Store the editable email
  email = '';

  // Store the current password
  currentPassword = '';

  // Store the new password
  newPassword = '';

  // Store the confirmation password
  confirmPassword = '';

  // Store notification information
  notificationMessage = '';
  notificationType = '';

  // Load the profile when the page opens
  ngOnInit() {
    this.loadProfile();
  }

  // Return to the dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Display a temporary notification
  showNotification(message: string, type: string) {
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
    }, 3000);
  }

  // Load the logged-in user's profile information
  loadProfile() {
    this.authService.getProfile().subscribe({

      // Store the profile information returned by the backend
      next: (response: any) => {
        this.currentUsername = response.username;
        this.currentEmail = response.email;

        this.username = response.username;
        this.email = response.email;

        this.changeDetector.detectChanges();
      },

      // Redirect to login if the profile cannot be loaded
      error: (error) => {
        console.error(error);

        this.showNotification(
          'Unable to load profile. Please log in again.',
          'error'
        );

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      }

    });
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

    return (
      password.length >= 5 &&
      passwordRegex.test(password) &&
      !password.includes(' ')
    );
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

  // Save profile changes
  saveChanges() {

    // Validate the username
    if (!this.isUsernameValid(this.username)) {
      this.showNotification(
        'Username must be at least 5 characters and contain no spaces.',
        'error'
      );
      return;
    }

    // Validate the email
    if (!this.isEmailValid(this.email)) {
      this.showNotification(
        'Please enter a valid email.',
        'error'
      );
      return;
    }

    // Validate password fields if the user is changing their password
    if (
      this.currentPassword ||
      this.newPassword ||
      this.confirmPassword
    ) {

      // Require the current password
      if (!this.currentPassword) {
        this.showNotification(
          'Current password is required to change your password.',
          'error'
        );
        return;
      }

      // Validate the new password
      if (!this.isPasswordValid(this.newPassword)) {
        this.showNotification(
          'Password must be at least 5 characters long, contain an uppercase letter, a number, and no spaces.',
          'error'
        );
        return;
      }

      // Verify that both passwords match
      if (!this.doPasswordsMatch(this.newPassword, this.confirmPassword)) {
        this.showNotification(
          'Passwords do not match.',
          'error'
        );
        return;
      }

    }

    // Create the profile update request object
    const profileData: any = {
      username: this.username,
      email: this.email
    };

    // Add password fields only if the user is changing their password
    if (this.currentPassword && this.newPassword) {
      profileData.current_password = this.currentPassword;
      profileData.new_password = this.newPassword;
    }

    // Send the profile update request
    this.authService.updateProfile(profileData).subscribe({

      // Display a success message and clear password fields
      next: (response: any) => {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        if (response.user) {
          this.currentUsername = response.user.username;
          this.currentEmail = response.user.email;

          this.username = response.user.username;
          this.email = response.user.email;
        }

        this.showNotification(
          'Profile updated successfully!',
          'success'
        );
      },

      // Display an error message if the update fails
      error: (error) => {
        console.error(error);

        if (error.error) {
          if (error.error.username) {
            this.showNotification(error.error.username[0], 'error');
          } else if (error.error.email) {
            this.showNotification(error.error.email[0], 'error');
          } else if (error.error.current_password) {
            this.showNotification(error.error.current_password[0], 'error');
          } else if (error.error.new_password) {
            this.showNotification(error.error.new_password[0], 'error');
          } else {
            this.showNotification(
              'Profile update failed. Please check your information.',
              'error'
            );
          }
        } else {
          this.showNotification(
            'Profile update failed. Please try again.',
            'error'
          );
        }
      }

    });
  }

}