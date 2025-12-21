import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Add New Room</h1>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg max-w-2xl mx-auto p-6">
          <form [formGroup]="createForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Room Number</label>
              <input
                type="text"
                formControlName="roomNumber"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Room Type ID</label>
              <input
                type="number"
                formControlName="roomTypeId"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                placeholder="e.g. 1 for Single, 2 for Double"
              />
              <p class="text-xs text-gray-500 mt-1">Check Room Types for valid IDs.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">isActive</label>
              <input
                type="checkbox"
                formControlName="isActive"
                class="mt-1 block border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Image Room</label>
              <input
                type="text"
                formControlName="imageRoom"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>

            @if (message) {
            <div [ngClass]="{ 'text-red-500': isError, 'text-green-500': !isError }">
              {{ message }}
            </div>
            }

            <div class="flex justify-end space-x-3">
              <a
                routerLink="/"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >Cancel</a
              >
              <button
                type="submit"
                [disabled]="createForm.invalid || isSubmitting"
                class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ isSubmitting ? 'Creating...' : 'Create Room' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class RoomCreateComponent {
  createForm: FormGroup;
  isSubmitting = false;
  message = '';
  isError = false;

  constructor(private fb: FormBuilder, private roomService: RoomService, private router: Router) {
    this.createForm = this.fb.group({
      roomNumber: ['', Validators.required],
      roomTypeId: ['', Validators.required],
      isActive: [false],
      imageRoom: [''],
    });
  }

  onSubmit() {
    if (this.createForm.valid) {
      this.isSubmitting = true;
      this.message = '';

      this.roomService.createRoom(this.createForm.value).subscribe({
        next: (room) => {
          this.isSubmitting = false;
          this.isError = false;
          this.message = 'Room created successfully!';
          setTimeout(() => this.router.navigate(['/']), 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.isError = true;
          this.message = 'Failed to create room. Ensure Room Number is unique and Type ID exists.';
          console.error(err);
        },
      });
    }
  }
}
