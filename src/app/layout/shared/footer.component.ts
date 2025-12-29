import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gray-900 text-white pt-6 pb-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div class="col-span-1 md:col-span-2">
            <a routerLink="/" class="flex items-center mb-2">
              <img
                src="https://imgur.com/VWlUj2J.png"
                alt="RoomReservation Logo"
                class="h-10 w-auto brightness-200"
              />
              <span class="ml-2 text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                RoomReserve
              </span>
            </a>
            <p class="text-sm text-gray-400 max-w-sm">
              Room booking system for the best hospitality experience.
            </p>
          </div>

          <div>
            <h3 class="text-md font-semibold mb-2 text-white">
              Contact Us
            </h3>
            <ul class="space-y-2 text-gray-400">
              <li>info@roomreserve.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {{ currentYear }} RoomReserve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
