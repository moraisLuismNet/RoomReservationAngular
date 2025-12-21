import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Room } from '../models/room.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/room`;
  private roomsCache: Room[] | null = null;

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    if (this.roomsCache) {
      return of(this.roomsCache);
    }

    return this.http
      .get<Room[]>(this.apiUrl, {
        params: {
          _limit: '20',
        },
      })
      .pipe(tap((rooms) => (this.roomsCache = rooms)));
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  createRoom(room: any): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room).pipe(
      tap(() => {
        // Invalidate cache after creating a new room
        this.roomsCache = null;
      })
    );
  }

  updateRoom(id: number, room: any): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room).pipe(
      tap(() => {
        // Invalidate cache after updating a room
        this.roomsCache = null;
      })
    );
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Invalidate cache after deleting a room
        this.roomsCache = null;
      })
    );
  }
}
