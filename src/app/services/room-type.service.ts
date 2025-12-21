import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomType } from '../models/room-type.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomTypeService {
  private apiUrl = `${environment.apiUrl}/roomtype`;

  constructor(private http: HttpClient) {}

  getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(this.apiUrl);
  }

  getRoomType(id: number): Observable<RoomType> {
    return this.http.get<RoomType>(`${this.apiUrl}/${id}`);
  }
}
