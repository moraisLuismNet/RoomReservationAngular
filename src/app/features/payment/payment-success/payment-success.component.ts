import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4"
    >
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <!-- Success Icon -->
        <div
          class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <svg
            class="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <!-- Loading State -->
        @if (isProcessing) {
        <div class="mb-6">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"
          ></div>
          <h2 class="text-xl font-semibold text-gray-800">Processing your payment...</h2>
          <p class="text-gray-500 mt-2">Please wait while we confirm your reservation.</p>
        </div>
        }

        <!-- Success State -->
        @if (!isProcessing && !error) {
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p class="text-gray-600 mb-6">
            Thank you for your reservation. A confirmation email has been sent to your registered
            email address.
          </p>

          <div class="bg-green-50 rounded-lg p-4 mb-6">
            <p class="text-sm text-green-800">
              <strong>Reservation ID:</strong> {{ reservationId }}
            </p>
          </div>

          <a
            routerLink="/my-reservations"
            class="inline-block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View My Reservations
          </a>

          <a
            routerLink="/"
            class="inline-block w-full mt-3 text-green-600 hover:text-green-800 font-medium"
          >
            Return to Home
          </a>
        </div>
        }

        <!-- Error State -->
        @if (error) {
        <div>
          <h1 class="text-2xl font-bold text-red-600 mb-2">Payment Verification Failed</h1>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <a
            routerLink="/"
            class="inline-block w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
        }
      </div>
    </div>
  `,
})
export class PaymentSuccessComponent implements OnInit {
  isProcessing = true;
  error: string | null = null;
  reservationId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    this.reservationId = this.route.snapshot.queryParamMap.get('reservation_id');

    if (sessionId) {
      this.confirmPayment(sessionId);
    } else {
      this.error = 'No session ID found. Please contact support.';
      this.isProcessing = false;
    }
  }

  private confirmPayment(sessionId: string): void {
    this.paymentService.confirmPayment(sessionId).subscribe({
      next: () => {
        this.isProcessing = false;
      },
      error: (err) => {
        console.error('Payment confirmation error:', err);
        this.error =
          'Failed to confirm payment. Your payment may have been processed - please check your email or contact support.';
        this.isProcessing = false;
      },
    });
  }
}
