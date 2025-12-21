import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/login');
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/rooms/room-list/room-list.component').then((m) => m.RoomListComponent),
  },
  {
    path: 'rooms',
    loadComponent: () =>
      import('./features/rooms/room-list/room-list.component').then((m) => m.RoomListComponent),
  },
  {
    path: 'rooms/add',
    loadComponent: () =>
      import('./features/rooms/room-create/room-create.component').then(
        (m) => m.RoomCreateComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'rooms/:id',
    loadComponent: () =>
      import('./features/rooms/room-detail/room-detail.component').then(
        (m) => m.RoomDetailComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'my-reservations',
    loadComponent: () =>
      import('./features/reservations/my-reservations/my-reservations.component').then(
        (m) => m.MyReservationsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'payment/success',
    loadComponent: () =>
      import('./features/payment/payment-success/payment-success.component').then(
        (m) => m.PaymentSuccessComponent
      ),
  },
  {
    path: 'payment/cancel',
    loadComponent: () =>
      import('./features/payment/payment-cancel/payment-cancel.component').then(
        (m) => m.PaymentCancelComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/management/management-navbar/management-navbar.component').then(
        (m) => m.ManagementNavbarComponent
      ),
    canActivate: [adminGuard],
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./features/management/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'reservations/calendar',
        loadComponent: () =>
          import(
            './features/management/reservations-calendar/reservations-calendar.component'
          ).then((m) => m.ReservationsCalendarComponent),
      },
      {
        path: 'reservations/list',
        loadComponent: () =>
          import('./features/management/reservations-list/reservations-list.component').then(
            (m) => m.ReservationsListComponent
          ),
      },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
