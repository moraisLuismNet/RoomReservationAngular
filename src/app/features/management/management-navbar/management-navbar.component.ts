import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-management-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          @if (showUsersTab()) {
          <a
            routerLink="/admin/users"
            routerLinkActive="border-indigo-500 text-indigo-600"
            [routerLinkActiveOptions]="{ exact: true }"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300"
          >
            Users
          </a>
          } @if (showCalendarTab()) {
          <a
            routerLink="/admin/reservations/calendar"
            routerLinkActive="border-indigo-500 text-indigo-600"
            [routerLinkActiveOptions]="{ exact: true }"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300"
          >
            Reservations Calendar
          </a>
          } @if (showListTab()) {
          <a
            routerLink="/admin/reservations/list"
            routerLinkActive="border-indigo-500 text-indigo-600"
            [routerLinkActiveOptions]="{ exact: true }"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300"
          >
            Reservations List
          </a>
          }
        </nav>
      </div>

      <!-- Router Outlet for Management Components -->
      <div class="mt-6">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class ManagementNavbarComponent {
  constructor(private router: Router) {}

  showUsersTab(): boolean {
    return this.router.url.includes('/admin/users');
  }

  showCalendarTab(): boolean {
    return this.router.url.includes('/admin/reservations/calendar');
  }

  showListTab(): boolean {
    return this.router.url.includes('/admin/reservations/list');
  }
}
