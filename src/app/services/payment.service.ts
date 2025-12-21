import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface CreateCheckoutSession {
  reservationId: number;
  amount: number;
  currency: string;
  productName?: string;
  productDescription?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
  publishableKey: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  createCheckoutSession(data: CreateCheckoutSession): Observable<CheckoutSessionResponse> {
    return this.http.post<CheckoutSessionResponse>(`${this.apiUrl}/create-checkout-session`, data);
  }

  confirmPayment(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm`, { sessionId });
  }

  redirectToCheckout(sessionUrl: string): void {
    // Direct redirect to Stripe Checkout URL
    window.location.href = sessionUrl;
  }
}
