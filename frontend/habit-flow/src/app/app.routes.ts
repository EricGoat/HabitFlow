// Import Angular routing types
import { Routes } from '@angular/router';

// Import application pages
import { Home } from './home/home';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Mission } from './mission/mission';
import { ProfileComponent } from './profile/profile';

// Define the application's routes
export const routes: Routes = [

  // Home page
  { path: '', component: Home },

  // Login page
  { path: 'login', component: Login },

  // Signup page
  { path: 'signup', component: Signup },

  // Mission page
  { path: 'mission', component: Mission },

  // User dashboard
  { path: 'dashboard', component: Dashboard },

  // User profile
  { path: 'profile', component: ProfileComponent },

  // Redirect unknown routes back home
  { path: '**', redirectTo: '' }

];