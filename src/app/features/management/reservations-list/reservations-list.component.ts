import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Reservation } from '../../../models/reservation.model';

@Component({
  selector: 'app-reservations-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-In
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-Out
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Guests
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let res of activeReservationsList">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ res.reservationId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ res.user?.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Room #{{ res.roomId }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ res.checkInDate | date : 'shortDate' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ res.checkOutDate | date : 'shortDate' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ res.numberOfGuests }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      [ngClass]="{
                        'bg-green-100 text-green-800': res.statusId === 1,
                        'bg-red-100 text-red-800': res.statusId === 5 || res.statusId === 3,
                        'bg-gray-100 text-gray-800': res.statusId === 2
                      }"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{
                        res.statusId === 1
                          ? 'Confirmed'
                          : res.statusId === 5
                          ? 'Cancelled'
                          : res.statusId === 3
                          ? 'Checked In'
                          : 'Pending'
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReservationsListComponent implements OnInit {
  reservations: Reservation[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.adminService.getAllReservations().subscribe({
      next: (reservations) => (this.reservations = reservations),
      error: (err) => console.error('Error loading reservations', err),
    });
  }

  get activeReservationsList(): Reservation[] {
    return this.reservations.filter((r) => r.statusId !== 5);
  }
}
