import { User } from './user.model';

export interface Reservation {
  reservationId: number;
  statusId: number;
  user?: User;
  roomId: number;
  reservationDate: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  cancellationDate?: string;
  cancellationReason?: string;
}

export interface CreateReservation {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  email?: string;
  reservationDate: string;
  numberOfNights: number;
}
