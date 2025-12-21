import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../models/reservation.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../../rooms/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  template: `
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">My Reservations</h1>

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
                        Room
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Check-in
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Check-out
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
                    <tr *ngFor="let reservation of reservations$ | async">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Room #{{ reservation.roomId }}
                        <!-- Ideally fetch Room Number via service or expand logic -->
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ reservation.checkInDate | date }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ reservation.checkOutDate | date }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          [ngClass]="{
                            'bg-green-100 text-green-800': reservation.statusId === 1,
                            'bg-red-100 text-red-800':
                              reservation.statusId === 3 || reservation.statusId === 5
                          }"
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        >
                          {{
                            reservation.statusId === 1
                              ? 'Confirmed'
                              : reservation.statusId === 3 || reservation.statusId === 5
                              ? 'Cancelled'
                              : 'Pending'
                          }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        @if (reservation.statusId !== 5 && reservation.statusId !== 3) {
                        <button
                          (click)="openCancelModal(reservation.reservationId)"
                          [disabled]="!canCancel(reservation.checkInDate)"
                          [ngClass]="{
                            'text-red-600 hover:text-red-900': canCancel(reservation.checkInDate),
                            'text-gray-400 cursor-not-allowed': !canCancel(reservation.checkInDate)
                          }"
                          class="font-medium mr-2"
                        >
                          Cancel
                        </button>
                        }
                        <a
                          [href]="getGoogleCalendarUrl(reservation)"
                          target="_blank"
                          class="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Add to GCal
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              @if ((reservations$ | async)?.length === 0) {
              <div class="mt-4 text-gray-500 text-center">No reservations found.</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

    <app-confirmation-modal
      [isVisible]="showCancelModal"
      title="Cancel Reservation"
      message="Are you sure you want to cancel this reservation?"
      (confirmed)="onConfirmCancel()"
      (cancelled)="onCancelModal()"
    ></app-confirmation-modal>

    <app-confirmation-modal
      [isVisible]="showErrorModal"
      title="Error"
      [message]="errorMessage"
      (confirmed)="onCloseErrorModal()"
      (cancelled)="onCloseErrorModal()"
    ></app-confirmation-modal>
  `,
})
export class MyReservationsComponent implements OnInit {
  reservations$!: Observable<Reservation[]>;
  showCancelModal: boolean = false;
  showErrorModal: boolean = false;
  errorMessage: string = '';
  private reservationIdToCancel: number | null = null;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservations$ = this.reservationService
      .getMyReservations()
      .pipe(map((reservations) => reservations.filter((r) => r.statusId !== 5)));
  }

  openCancelModal(id: number): void {
    this.reservationIdToCancel = id;
    this.showCancelModal = true;
  }

  onConfirmCancel(): void {
    if (this.reservationIdToCancel !== null) {
      this.reservationService.cancelReservation(this.reservationIdToCancel).subscribe({
        next: () => {
          this.loadReservations();
          this.showCancelModal = false;
        },
        error: (err) => {
          console.error('Error cancelling reservation', err);
          const errorMessage =
            err.error ||
            'Failed to cancel reservation. Please checking cancellation policy (24h before check-in).';
          this.errorMessage = errorMessage;
          this.showErrorModal = true;
        },
      });
    }
  }

  onCancelModal(): void {
    this.showCancelModal = false;
  }

  onCloseErrorModal(): void {
    this.showErrorModal = false;
  }

  canCancel(checkInDate: string | Date): boolean {
    const checkIn = new Date(checkInDate);
    const now = new Date();
    const diffInMs = checkIn.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours >= 24;
  }

  getGoogleCalendarUrl(reservation: Reservation): string {
    const title = encodeURIComponent(`Reservation Item Room #${reservation.roomId}`);
    const details = encodeURIComponent(`Reservation for ${reservation.numberOfGuests} guests.`);

    // Format dates to YYYYMMDD
    const start = new Date(reservation.checkInDate)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '')
      .split('T')[0];
    const end = new Date(reservation.checkOutDate)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '')
      .split('T')[0];
    // Google Calendar all-day events are inclusive of start, exclusive of end.
    // However, if we want to show CheckIn to CheckOut as all occupied days, standard is usually fine.
    // If we want it to be specific times, we can add T140000Z and T110000Z.
    // Let's stick to YYYYMMDD for simplicity as usually hotel bookings are per night.
    // Note: Google Calendar all-day event ends on the *next* day. So if I book 1st to 2nd, it shows on 1st.
    // Our CheckOutDate is the day we leave. So if I book 1st to 2nd (1 night), I want it to show on 1st.
    // If I use 20230101 / 20230102, it shows on Jan 1. This matches logic.

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  }
}
