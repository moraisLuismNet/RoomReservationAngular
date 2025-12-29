import { User } from './user.model';
import { Room } from './room.model';

export interface Reservation {
  reservationId: number;
  statusId: number;

  user?: User;
  room?: Room;
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
