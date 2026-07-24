// Import Angular's route guard utilities
import { CanActivateFn, Router } from '@angular/router';

// Import Angular's dependency injection helper
import { inject } from '@angular/core';

// Route guard that checks if the user is authenticated
export const authGuard: CanActivateFn = () => {

  // Get the Angular router
  const router = inject(Router);

  // Check if an authentication token exists
  const token = localStorage.getItem('token');

  // Allow access if the user is logged in
  if (token) {
    return true;
  }

  // Otherwise, redirect to the login page
  return router.createUrlTree(['/login']);
};