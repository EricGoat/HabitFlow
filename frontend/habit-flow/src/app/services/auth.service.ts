import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient) {}

  register(userData: any) {
    return this.http.post(
      `${this.apiUrl}/register/`,
      userData
    )
  }

  login(credentials: any) {
    return this.http.post(
      `${this.apiUrl}/login/`,
      credentials
    )
  }
}
