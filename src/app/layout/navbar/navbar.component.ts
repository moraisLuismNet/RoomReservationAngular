import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img
                src="https://imgur.com/VWlUj2J.png"
                alt="RoomReservation Logo"
                class="h-20 w-auto"
              />
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a
                routerLink="/"
                [routerLinkActive]="'opacity-50 cursor-default'"
                [routerLinkActiveOptions]="{ exact: true }"
                [attr.aria-disabled]="isActive('/')"
                (click)="$event.preventDefault()"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                [class.border-indigo-500]="isActive('/')"
              >
                Rooms
              </a>
              @if (isLoggedIn && !isAdmin) {
              <a
                routerLink="/my-reservations"
                [routerLinkActive]="'opacity-50 cursor-default'"
                [attr.aria-disabled]="isActive('/my-reservations')"
                (click)="$event.preventDefault()"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                [class.border-indigo-500]="isActive('/my-reservations')"
              >
                My Reservations
              </a>
              } @if (isAdmin) {
              <a
                routerLink="/admin/reservations/list"
                [routerLinkActive]="'opacity-50 cursor-default'"
                [attr.aria-disabled]="isActive('/admin/reservations/list')"
                (click)="$event.preventDefault()"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                [class.border-indigo-500]="isActive('/admin/reservations/list')"
              >
                Reservations List
              </a>
              <a
                routerLink="/admin/reservations/calendar"
                [routerLinkActive]="'opacity-50 cursor-default'"
                [attr.aria-disabled]="isActive('/admin/reservations/calendar')"
                (click)="$event.preventDefault()"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                [class.border-indigo-500]="isActive('/admin/reservations/calendar')"
              >
                Reservations Calendar
              </a>
              <a
                routerLink="/admin/users"
                routerLinkActive="border-indigo-500 text-gray-900"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Users
              </a>
              }
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            @if (isLoggedIn) {
            <span class="text-gray-700 text-sm mr-4">Welcome, {{ userEmail }}</span>
            <button
              (click)="logout()"
              class="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Logout
            </button>
            } @else {
            <a
              routerLink="/login"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >Login</a
            >
            <a
              routerLink="/register"
              class="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium ml-2"
              >Register</a
            >
            }
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userEmail(): string | undefined {
    return this.authService.getUser()?.email;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
  }
}
