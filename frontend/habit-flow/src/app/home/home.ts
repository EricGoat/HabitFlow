// Import Angular's component decorator
import { Component } from '@angular/core';

// Import Angular routing module
import { RouterModule } from '@angular/router';


// Displays the application's home page
@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}