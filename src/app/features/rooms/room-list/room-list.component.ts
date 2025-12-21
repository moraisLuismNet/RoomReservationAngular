import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { AuthService } from '../../../services/auth.service';
import { Room } from '../../../models/room.model';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white">
      <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-extrabold tracking-tight text-gray-900">Available Rooms</h2>
          @if (isAdmin) {
          <a
            routerLink="/rooms/add"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >Add Room</a
          >
          }
        </div>

        <div
          class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          <div *ngFor="let room of paginatedRooms" class="group relative">
            <div
              class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none"
            >
              <!-- Room image with lazy loading -->
              <img
                [src]="
                  room.imageRoom ||
                  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                "
                alt="Room image"
                class="w-full h-full object-center object-cover lg:w-full lg:h-full"
                loading="eager"
              />
            </div>
            <div class="mt-4 flex justify-between">
              <div>
                <h3 class="text-sm text-gray-700">
                  <a [routerLink]="['/rooms', room.roomId]">
                    <span aria-hidden="true" class="absolute inset-0"></span>
                    Room {{ room.roomNumber }}
                  </a>
                </h3>
                <p class="mt-1 text-sm text-gray-500">{{ room.roomTypeName }}</p>
                <p class="mt-1 text-sm text-gray-500">Capacity: {{ room.capacity }} people</p>
              </div>
              <p class="text-sm font-medium text-gray-900">€{{ room.pricePerNight }} / night</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            (click)="prevPage()"
            [disabled]="currentPage === 1"
            class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <div class="flex space-x-1">
            <button
              *ngFor="let page of [].constructor(totalPages); let i = index"
              (click)="goToPage(i + 1)"
              [class.bg-indigo-600]="currentPage === i + 1"
              [class.text-black]="currentPage === i + 1"
              [class.font-bold]="currentPage === i + 1"
              class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            >
              {{ i + 1 }}
            </button>
          </div>
          <button
            (click)="nextPage()"
            [disabled]="currentPage === totalPages"
            class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  `,
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private roomService: RoomService, private authService: AuthService) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.roomService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
      this.totalItems = rooms.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    });
  }

  get paginatedRooms(): Room[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.rooms.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
