import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    // If the user is not authenticated, redirect to the login page
    console.log('Admin Guard - User not logged in, redirecting to login');
    return router.createUrlTree(['/login'], { 
      queryParams: { 
        returnUrl: router.url 
      } 
    });
  }

  if (!authService.isAdmin()) {
    // If the user is authenticated but not an admin, redirect to home or show an error
    console.log('Admin Guard - User is not admin, redirecting to home');
    return router.parseUrl('/');
  }

  // User is authenticated and is an admin, allow access
  console.log('Admin Guard - Access granted');
  return true;
};
