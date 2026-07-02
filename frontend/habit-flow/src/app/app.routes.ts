// Import Angular routing types
import { Routes } from '@angular/router';

// Import application pages
import { Home } from './home/home';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';


// Define the application's routes
export const routes: Routes = [

  // Home page
  { path: '', component: Home },

  // Login page
  { path: 'login', component: Login },

  // Signup page
  { path: 'signup', component: Signup },

  // User dashboard
  { path: 'dashboard', component: Dashboard }

];