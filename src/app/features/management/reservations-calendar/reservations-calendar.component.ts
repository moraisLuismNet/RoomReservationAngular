import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AdminService } from '../../../services/admin.service';
import { Reservation } from '../../../models/reservation.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservations-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  template: `
    <div class="bg-white p-6 shadow rounded-lg">
      <!-- Booking Summary Section -->
      <div class="mb-6 p-4 bg-indigo-50 rounded-lg">
        <h2 class="text-xl font-semibold text-indigo-900 mb-4">
          Reservations {{ currentView === 'dayGridMonth' ? 'Of The Month' : 'de la Semana' }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="text-sm font-medium text-gray-500">Total Reservations</div>
            <div class="text-2xl font-bold text-indigo-900">{{ currentBookings.length }}</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="text-sm font-medium text-gray-500">Occupied Rooms</div>
            <div class="text-2xl font-bold text-indigo-900">{{ getUniqueRooms().length }}</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <div class="text-sm font-medium text-gray-500">Total Guests</div>
            <div class="text-2xl font-bold text-indigo-900">{{ getTotalGuests() }}</div>
          </div>
        </div>

        <div class="mt-4">
          <h3 class="font-medium text-gray-700 mb-2">Active Reservations:</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-lg overflow-hidden">
              <thead class="bg-indigo-100">
                <tr>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-in
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-out
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Guests
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr *ngFor="let booking of currentBookings" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">Habitación {{ booking.roomId }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ booking.user?.email || 'not specified' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ booking.checkInDate | date : 'dd/MM/yyyy' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ booking.checkOutDate | date : 'dd/MM/yyyy' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ booking.numberOfGuests }}</td>
                </tr>
                @if (currentBookings.length === 0) {
                <tr>
                  <td colspan="5" class="px-4 py-4 text-center text-sm text-gray-500">
                    There are no bookings during this period.
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Calendar -->
      <full-calendar [options]="calendarOptions"></full-calendar>
    </div>
  `,
})
export class ReservationsCalendarComponent implements OnInit {
  reservations: Reservation[] = [];
  currentBookings: Reservation[] = [];
  currentView: 'dayGridMonth' | 'dayGridWeek' = 'dayGridMonth';
  currentDateRange = { start: new Date(), end: new Date() };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
    datesSet: (dateInfo) => this.handleDatesChanged(dateInfo),
    viewDidMount: (view) => {
      this.currentView = view.view.type as 'dayGridMonth' | 'dayGridWeek';
    },
    events: [],
    eventColor: '#3730a3', // indigo-900
    displayEventTime: false,
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.adminService.getAllReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        // Calendar shows active + checked in + pending, basically anything occupying room.
        const activeForCalendar = reservations.filter((r) => r.statusId !== 5 && r.statusId !== 6);

        this.calendarOptions = {
          ...this.calendarOptions,
          events: activeForCalendar.map((r) => ({
            title: `Habitación ${r.roomId} (${r.numberOfGuests}p)`,
            start: r.checkInDate,
            end: r.checkOutDate,
            allDay: true,
            extendedProps: {
              user: r.user?.email,
            },
          })),
        };

        // Update current bookings for the initial view
        this.updateCurrentBookings();
      },
      error: (err) => console.error('Error loading reservations', err),
    });
  }

  handleDatesChanged(dateInfo: { start: Date; end: Date }) {
    this.currentDateRange = {
      start: dateInfo.start,
      end: dateInfo.end,
    };
    this.updateCurrentBookings();
  }

  updateCurrentBookings() {
    if (!this.reservations || this.reservations.length === 0) return;

    // Filter reservations that overlap with the current date range
    this.currentBookings = this.reservations.filter((reservation) => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      // Check if the reservation overlaps with the current view period
      return (
        checkIn <= this.currentDateRange.end &&
        checkOut >= this.currentDateRange.start &&
        reservation.statusId !== 5 &&
        reservation.statusId !== 6
      );
    });
  }

  getUniqueRooms(): number[] {
    return [...new Set(this.currentBookings.map((booking) => booking.roomId))];
  }

  getTotalGuests(): number {
    return this.currentBookings.reduce((sum, booking) => sum + (booking.numberOfGuests || 0), 0);
  }
}
