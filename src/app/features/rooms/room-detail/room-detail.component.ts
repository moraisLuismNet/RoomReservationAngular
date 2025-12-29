import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomService } from '../../../services/room.service';
import { RoomTypeService } from '../../../services/room-type.service';
import { ReservationService } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';
import { PaymentService } from '../../../services/payment.service';
import { Room } from '../../../models/room.model';
import { RoomType } from '../../../models/room-type.model';
import { Reservation, CreateReservation } from '../../../models/reservation.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FullCalendarModule,
    ConfirmationModalComponent,
  ],
  template: `
    @if (room) {
    <div class="bg-white">
      <div class="pt-6">
        <div
          class="max-w-2xl mx-auto px-4 pt-10 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8"
        >
          <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              Room {{ room.roomNumber }}
            </h1>
            <div class="mt-6">
              <full-calendar [options]="calendarOptions"></full-calendar>
            </div>
          </div>

          <!-- Options / Booking Form -->
          <div class="mt-4 lg:mt-0 lg:row-span-3">
            <h2 class="text-xl font-bold text-gray-900">Book this room</h2>

            <!-- Admin Controls -->
            @if (isAdmin) {
            <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex space-x-3">
                <button
                  (click)="toggleEditMode()"
                  [disabled]="hasReservations"
                  class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isEditMode ? 'Cancel Edit' : 'Edit Room' }}
                </button>
                <button
                  (click)="deleteRoom()"
                  [disabled]="hasReservations"
                  class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Cannot edit or delete if room has future reservations"
                >
                  Delete Room
                </button>
              </div>
              @if (isEditMode) {
              <div [formGroup]="editForm" class="mt-4 space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    formControlName="roomNumber"
                    type="text"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm"
                    placeholder="Room Number"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1"
                    >Room Type (Affects Price/Desc)</label
                  >
                  <select
                    formControlName="roomTypeId"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm"
                  >
                    @for (type of roomTypes; track type.roomTypeId) {
                    <option [value]="type.roomTypeId">
                      {{ type.roomTypeName }} (€{{ type.pricePerNight }}/night)
                    </option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    formControlName="imageRoom"
                    type="text"
                    class="block w-full border-gray-300 rounded-md shadow-sm p-2 border text-sm"
                    placeholder="Image URL"
                  />
                </div>
                <div class="flex items-center">
                  <input
                    formControlName="isActive"
                    type="checkbox"
                    id="isActive"
                    class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label for="isActive" class="ml-2 block text-sm text-gray-900"> Active </label>
                </div>
                <button
                  (click)="saveRoom()"
                  class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
              }
            </div>
            } @if (!isEditMode) {
            <p class="text-3xl text-gray-900 mt-2">€{{ room.pricePerNight }} / night</p>
            } @if (!isLoggedIn) {
            <div class="mt-8">
              <p class="text-gray-500 mb-4">You need to be logged in to make a reservation.</p>
              <a
                routerLink="/login"
                class="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700"
                >Sign in to book</a
              >
            </div>
            } @if (isLoggedIn && !isAdmin) {
            <div class="mt-8">
              <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Check-in Date</label>
                    <input
                      formControlName="checkInDate"
                      type="date"
                      [min]="minCheckInDate"
                      (change)="onCheckInDateChange()"
                      (blur)="validateCheckInDate()"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Check-out Date</label>
                    <input
                      formControlName="checkOutDate"
                      type="date"
                      [min]="minCheckOutDate"
                      (blur)="validateCheckOutDate()"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Number of Guests</label>
                    <input
                      formControlName="numberOfGuests"
                      type="number"
                      min="1"
                      [max]="room.capacity"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  @if (message) {
                  <div
                    [ngClass]="{ 'text-red-500': isError, 'text-green-500': !isError }"
                    class="text-sm"
                  >
                    {{ message }}
                  </div>
                  }

                  <!-- Calculated Total Price -->
                  @if (calculatedTotal > 0) {
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Total ({{ calculatedNights }} nights)</span>
                      <span class="text-xl font-bold text-gray-900">€{{ calculatedTotal }}</span>
                    </div>
                  </div>
                  }

                  <div class="flex space-x-3">
                    @if (hasDatesSelected) {
                    <button
                      type="button"
                      (click)="resetForm()"
                      class="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    }
                    <button
                      type="submit"
                      [disabled]="bookingForm.invalid || isSubmitting"
                      class="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      {{ isSubmitting ? 'Processing...' : 'Proceed to Payment' }}
                    </button>
                  </div>

                  <p class="text-xs text-gray-500 text-center mt-2">
                    You will be redirected to Stripe for secure payment
                  </p>
                </div>
              </form>
            </div>
            } @if (!isAdmin) {
            <div
              class="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8"
            >
              <div>
                <h3 class="sr-only">Description</h3>
                <div class="space-y-6">
                  <p class="text-base text-gray-900">{{ room.description }}</p>
                </div>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
    }
    <app-confirmation-modal
      [isVisible]="showDeleteModal"
      title="Delete Room"
      message="Are you sure you want to delete this room?"
      (confirmed)="onDeleteConfirmed()"
      (cancelled)="onDeleteCancelled()"
    ></app-confirmation-modal>
  `,
})
export class RoomDetailComponent implements OnInit {
  room: Room | null = null;
  roomTypes: RoomType[] = [];
  bookingForm: FormGroup;
  editForm: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  roomReservations: Reservation[] = [];
  message = '';
  isError = false;
  minCheckInDate: string = '';
  minCheckOutDate: string = '';
  reservedDates: string[] = [];
  showDeleteModal = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek',
    },
    events: [],
    eventColor: 'red',
    displayEventTime: false,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numberOfGuests: [1, [Validators.required, Validators.min(1)]],
    });
    this.editForm = this.fb.group({
      roomNumber: ['', Validators.required],
      roomTypeId: ['', Validators.required],
      isActive: [true],
      imageRoom: [''],
    });
  }

  get calculatedNights(): number {
    const checkIn = this.bookingForm.get('checkInDate')?.value;
    const checkOut = this.bookingForm.get('checkOutDate')?.value;
    if (checkIn && checkOut) {
      return this.calculateNights(checkIn, checkOut);
    }
    return 0;
  }

  get calculatedTotal(): number {
    if (this.room && this.calculatedNights > 0) {
      return this.room.pricePerNight * this.calculatedNights;
    }
    return 0;
  }

  get hasDatesSelected(): boolean {
    const checkIn = this.bookingForm.get('checkInDate')?.value;
    const checkOut = this.bookingForm.get('checkOutDate')?.value;
    return !!(checkIn && checkOut);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get hasReservations(): boolean {
    // Check if there are any active reservations (not cancelled) from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.roomReservations.some((r) => {
      const checkIn = new Date(r.checkInDate);
      return r.statusId !== 5 && r.statusId !== 6 && checkIn >= today;
    });
  }

  get futureReservations(): Reservation[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.roomReservations.filter((r) => {
      const checkIn = new Date(r.checkInDate);
      return checkIn >= today;
    });
  }

  ngOnInit(): void {
    this.checkAndCancelPendingReservation();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const roomId = parseInt(id, 10);
      if (!isNaN(roomId)) {
        this.loadRoom(roomId);
        this.loadRoomTypes();
      }
    }
  }

  checkAndCancelPendingReservation() {
    const pendingReservationId = localStorage.getItem('pending_reservation_id');
    if (pendingReservationId) {
      const id = parseInt(pendingReservationId, 10);
      if (!isNaN(id)) {
        console.log('Found pending reservation, cancelling...', id);
        this.reservationService.cancelReservation(id).subscribe({
          next: () => console.log('Pending reservation cancelled successfully'),
          error: (err) => console.error('Error cancelling pending reservation', err),
          complete: () => localStorage.removeItem('pending_reservation_id'),
        });
      } else {
        localStorage.removeItem('pending_reservation_id');
      }
    }
  }

  loadRoom(roomId: number) {
    this.roomService.getRoom(roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.bookingForm
          .get('numberOfGuests')
          ?.setValidators([Validators.required, Validators.min(1), Validators.max(room.capacity)]);
        this.bookingForm.get('numberOfGuests')?.updateValueAndValidity();
        this.loadReservations(room.roomId);
        this.setMinDates();
      },
      error: (err) => console.error('Error loading room', err),
    });
  }

  loadRoomTypes() {
    this.roomTypeService.getRoomTypes().subscribe({
      next: (types) => {
        this.roomTypes = types;
      },
      error: (err) => console.error('Error loading room types', err),
    });
  }

  loadReservations(roomId: number) {
    this.reservationService.getReservationsByRoom(roomId).subscribe({
      next: (reservations) => {
        this.roomReservations = reservations;
        this.reservedDates = this.getReservedDates(reservations);
        this.calendarOptions = {
          ...this.calendarOptions,
          events: reservations.map((r) => ({
            title: 'Reserved',
            start: r.checkInDate,
            end: r.checkOutDate,
            color: 'red',
            allDay: true,
          })),
        };
      },
      error: (err) => console.error('Error loading reservations', err),
    });
  }

  getReservedDates(reservations: Reservation[]): string[] {
    const dates: string[] = [];
    reservations.forEach((reservation) => {
      const startDate = new Date(reservation.checkInDate);
      const endDate = new Date(reservation.checkOutDate);
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split('T')[0];
        dates.push(formattedDate);
      }
    });
    return dates;
  }

  setMinDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minCheckInDate = `${year}-${month}-${day}`;
    this.minCheckOutDate = `${year}-${month}-${day}`;
  }

  onCheckInDateChange() {
    const checkInDate = this.bookingForm.get('checkInDate')?.value;
    if (checkInDate) {
      const selectedDate = new Date(checkInDate);
      selectedDate.setDate(selectedDate.getDate() + 1);
      this.minCheckOutDate = selectedDate.toISOString().split('T')[0];
      this.bookingForm.get('checkOutDate')?.setValue('');
    }
  }

  validateCheckInDate() {
    const checkInDate = this.bookingForm.get('checkInDate')?.value;
    if (checkInDate && this.isDateReserved(checkInDate, checkInDate)) {
      this.isError = true;
      this.message =
        'The selected check-in date is already reserved. Please choose a different date.';
      this.bookingForm.get('checkInDate')?.setValue('');
    }
  }

  validateCheckOutDate() {
    const checkOutDate = this.bookingForm.get('checkOutDate')?.value;
    if (checkOutDate && this.isDateReserved(checkOutDate, checkOutDate)) {
      this.isError = true;
      this.message =
        'The selected check-out date is already reserved. Please choose a different date.';
      this.bookingForm.get('checkOutDate')?.setValue('');
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.room) {
      this.editForm.patchValue({
        roomNumber: this.room.roomNumber,
        roomTypeId: this.room.roomTypeId,
        isActive: this.room.isActive,
        imageRoom: this.room.imageRoom,
      });
    }
  }

  saveRoom() {
    if (this.editForm.valid && this.room) {
      const formValues = this.editForm.value;
      const updatedRoom = {
        roomId: this.room.roomId,
        roomNumber: formValues.roomNumber,
        roomTypeId: parseInt(formValues.roomTypeId, 10),
        isActive: formValues.isActive,
        imageRoom: formValues.imageRoom,
      };
      this.roomService.updateRoom(this.room.roomId, updatedRoom).subscribe({
        next: (response) => {
          this.loadRoom(this.room!.roomId); // Reload room to get updated details (including RoomType info)
          this.isEditMode = false;
          this.message = 'Room updated successfully';
          this.isError = false;
        },
        error: (err) => {
          console.error('Error updating room', err);
          this.message = 'Failed to update room. Please check the console for details.';
          this.isError = true;
        },
      });
    } else {
      this.message = 'Please fill in all required fields.';
      this.isError = true;
    }
  }

  deleteRoom() {
    if (this.room) {
      this.showDeleteModal = true;
    }
  }

  onDeleteConfirmed() {
    if (this.room) {
      this.roomService.deleteRoom(this.room.roomId).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error deleting room', err);
          // Likely foreign key constraint if my frontend check failed or race condition
          this.message = 'Failed to delete room. Ensure it has no reservations.';
          this.isError = true;
        },
      });
    }
  }

  onDeleteCancelled() {
    // No action needed, just close the modal
  }

  onSubmit() {
    if (this.bookingForm.valid && this.room) {
      const formValue = this.bookingForm.value;
      const checkInDate = formValue.checkInDate;
      const checkOutDate = formValue.checkOutDate;

      // Check if selected dates are reserved
      const isReserved = this.isDateReserved(checkInDate, checkOutDate);
      if (isReserved) {
        this.isError = true;
        this.message = 'Selected dates are already reserved. Please choose different dates.';
        return;
      }

      this.isSubmitting = true;
      this.message = 'Creating reservation...';
      this.isError = false;

      const reservation: CreateReservation = {
        roomId: this.room.roomId,
        checkInDate: new Date(formValue.checkInDate).toISOString(),
        checkOutDate: new Date(formValue.checkOutDate).toISOString(),
        numberOfGuests: formValue.numberOfGuests,
        email: this.authService.getUser()?.email,
        reservationDate: new Date().toISOString(),
        numberOfNights: this.calculateNights(formValue.checkInDate, formValue.checkOutDate),
      };

      const totalAmount = this.calculatedTotal;
      const roomInfo = this.room;

      this.reservationService.createReservation(reservation).subscribe({
        next: (response: any) => {
          this.message = 'Redirecting to payment...';

          // Create Stripe checkout session
          this.paymentService
            .createCheckoutSession({
              reservationId: response.reservationId,
              amount: totalAmount,
              currency: 'eur',
              productName: `Room ${roomInfo.roomNumber} Reservation`,
              productDescription: `Check-in: ${checkInDate} | Check-out: ${checkOutDate} | ${reservation.numberOfNights} nights`,
            })
            .subscribe({
              next: (checkoutResponse) => {
                // Save reservation ID to localStorage to handle "Back" navigation
                if (response.reservationId) {
                  localStorage.setItem('pending_reservation_id', response.reservationId.toString());
                }
                // Redirect to Stripe checkout using the session URL
                this.paymentService.redirectToCheckout(checkoutResponse.sessionUrl);
              },
              error: (err) => {
                this.isSubmitting = false;
                this.isError = true;
                this.message = 'Failed to create payment session. Please try again.';
                console.error('Checkout session error:', err);
              },
            });
        },
        error: (err) => {
          this.isSubmitting = false;
          this.isError = true;
          this.message = 'Failed to create reservation. Please try again.';
          console.error(err);
        },
      });
    }
  }

  isDateReserved(checkInDate: string, checkOutDate: string): boolean {
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const formattedDate = date.toISOString().split('T')[0];
      if (this.reservedDates.includes(formattedDate)) {
        return true;
      }
    }
    return false;
  }

  private calculateNights(start: string, end: string): number {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  resetForm() {
    this.bookingForm.reset({
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
    });
    this.message = '';
    this.isError = false;
    this.setMinDates();
  }
}
