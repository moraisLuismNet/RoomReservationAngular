import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4"
    >
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <!-- Cancel Icon -->
        <div
          class="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6"
        >
          <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p class="text-gray-600 mb-6">
          Your payment was cancelled. Your reservation is still pending and will be automatically
          cancelled if not paid within 24 hours.
        </p>

        @if (reservationId) {
        <div class="bg-orange-50 rounded-lg p-4 mb-6">
          <p class="text-sm text-orange-800">
            <strong>Reservation ID:</strong> {{ reservationId }}
          </p>
        </div>
        }

        <a
          [routerLink]="reservationId ? ['/rooms', reservationId] : ['/']"
          class="inline-block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-3"
        >
          Try Again
        </a>

        <a routerLink="/" class="inline-block w-full text-gray-600 hover:text-gray-800 font-medium">
          Return to Home
        </a>
      </div>
    </div>
  `,
})
export class PaymentCancelComponent implements OnInit {
  reservationId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.reservationId = this.route.snapshot.queryParamMap.get('reservation_id');
  }
}
