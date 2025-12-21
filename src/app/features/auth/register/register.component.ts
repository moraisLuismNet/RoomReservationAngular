import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div class="relative">
              <label class="sr-only">Full Name</label>
              <input
                formControlName="fullName"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Full Name"
              />
              @if (registerForm.get('fullName')?.touched &&
              registerForm.get('fullName')?.errors?.['required']) {
              <span class="text-xs text-red-500 mt-1 block px-3">Full name is required</span>
              }
            </div>
            <div class="relative">
              <label class="sr-only">Email address</label>
              <input
                formControlName="email"
                type="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Email address"
              />
              @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors) {
              <div class="px-3 py-1">
                @if (registerForm.get('email')?.errors?.['required']) {
                <span class="text-xs text-red-500 block">Email is required</span>
                } @if (registerForm.get('email')?.errors?.['email']) {
                <span class="text-xs text-red-500 block">Invalid email format</span>
                }
              </div>
              }
            </div>
            <div class="relative">
              <label class="sr-only">Phone Number</label>
              <input
                formControlName="phoneNumber"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Phone Number"
              />
              @if (registerForm.get('phoneNumber')?.touched &&
              registerForm.get('phoneNumber')?.errors?.['required']) {
              <span class="text-xs text-red-500 mt-1 block px-3">Phone number is required</span>
              }
            </div>
            <div class="relative">
              <label class="sr-only">Password</label>
              <input
                formControlName="password"
                type="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Password"
              />
              @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors) {
              <div class="px-3 py-1">
                @if (registerForm.get('password')?.errors?.['required']) {
                <span class="text-xs text-red-500 block">Password is required</span>
                } @if (registerForm.get('password')?.errors?.['minlength']) {
                <span class="text-xs text-red-500 block"
                  >Password must be at least 6 characters</span
                >
                }
              </div>
              }
            </div>
          </div>

          @if (errorMessage) {
          <div class="text-red-500 text-sm text-center animate-pulse">
            {{ errorMessage }}
          </div>
          } @if (successMessage) {
          <div class="text-green-500 text-sm text-center">
            {{ successMessage }}
          </div>
          }

          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Register
            </button>
          </div>
          <div class="text-center">
            <a routerLink="/login" class="text-indigo-600 hover:text-indigo-500"
              >Already have an account? Login</a
            >
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Registration failed. Please try again.';
          console.error(err);
        },
      });
    }
  }
}
