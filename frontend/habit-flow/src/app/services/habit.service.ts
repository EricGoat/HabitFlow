// Import Angular's dependency injection decorator
import { Injectable } from '@angular/core';

// Import Angular's HTTP client and HTTP headers
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Import Observable for handling asynchronous API requests
import { Observable } from 'rxjs';


// Service for handling all habit-related API requests
@Injectable({
  providedIn: 'root',
})
export class HabitService {

  // Base URL for all habit endpoints
  private apiUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient) {}

  // Attach the user's authentication token to each request
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Token ${token}`
    });
  }

  // Retrieve all active habits for the logged-in user
  getHabits(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/habits/`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Create a new habit
  addHabit(habit: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/habits/`,
      habit,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Update a habit's completion status
  completeHabit(id: number, completed: boolean): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/habits/${id}/complete/`,
      {
        completed: completed
      },
      {
        headers: this.getHeaders()
      }
    );
  }

  // Soft delete a habit
  deleteHabit(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/habits/${id}/delete/`,
      {
        headers: this.getHeaders()
      }
    );
  }
}