// Import Angular's dependency injection decorator
import { Injectable } from '@angular/core';

// Import Angular's HTTP client for making API requests
import { HttpClient } from '@angular/common/http';


// Service responsible for handling user authentication
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Base URL for the authentication API
  private apiUrl = 'http://127.0.0.1:8000/api/users';

  // Inject Angular's HTTP client
  constructor(private http: HttpClient) {}

  // Send a registration request to create a new user account
  register(userData: any) {
    return this.http.post(
      `${this.apiUrl}/register/`,
      userData
    );
  }

  // Send login credentials and receive an authentication token
  login(credentials: any) {
    return this.http.post(
      `${this.apiUrl}/login/`,
      credentials
    );
  }
}