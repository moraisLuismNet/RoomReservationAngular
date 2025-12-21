import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Reservation, CreateReservation } from '../models/reservation.model';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createReservation(reservation: CreateReservation): Observable<any> {
    return this.http.post(this.apiUrl, reservation);
  }

  getMyReservations(): Observable<Reservation[]> {
    const user = this.authService.getUser();
    if (!user || !user.email) {
      return of([]);
    }
    return this.http.get<Reservation[]>(`${this.apiUrl}/${user.email}`);
  }

  getReservationsByRoom(roomId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/room/${roomId}`);
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
