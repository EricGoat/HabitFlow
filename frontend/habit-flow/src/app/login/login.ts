import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username: string = ''
  password: string = ''
  response: string = ''

  constructor(private authService: AuthService) {}

  login() {
    const credentials = {
      username: this.username,
      password: this.password
    }

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token)
        this.response = 'Login successful'
      },
      error: ()=> {
        this.response = 'Invalid username or password'
      }
    })
  }
}
