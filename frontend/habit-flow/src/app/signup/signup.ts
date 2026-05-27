import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  constructor(private authService: AuthService) {}

  errors: string[] = [];

  isUsernameValid(username: string): boolean {
    return username.length >= 5 && !username.includes(' ');
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isPasswordValid(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    return passwordRegex.test(password) && !password.includes(' ');
  }

  doPasswordsMatch(
    password: string,
    confirmPassword: string
  ): boolean {
    return (
      confirmPassword.length > 0 &&
      password === confirmPassword
    );
  }

  onSubmit(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    this.errors = [];

    if (!this.isUsernameValid(username)) {
      this.errors.push(
        'Username must be at least 5 characters and contain no spaces.'
      );
    }

    if (!this.isEmailValid(email)) {
      this.errors.push(
        'Please enter a valid email.'
      );
    }

    if (!this.isPasswordValid(password)) {
      this.errors.push(
        'Password must contain an uppercase letter, a number, and no spaces.'
      );
    }

    if (!this.doPasswordsMatch(password, confirmPassword)) {
      this.errors.push(
        'Passwords do not match.'
      );
    }

    if (this.errors.length > 0) {
      alert(this.errors.join('\n'));
      return;
    }

    const userData = {
      username: username,
      email: email,
      password: password
    }

    this.authService.register(userData).subscribe({
      next: (response) => {
        alert('Signup successful!');
      },
      error: (error) => {
        alert(error)
      }
    })

  }
}
