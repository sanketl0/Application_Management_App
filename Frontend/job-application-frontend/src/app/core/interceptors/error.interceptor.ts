import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            // Clear token and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Access forbidden';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Internal server error';
            break;
          default:
            if (error.error?.error) {
              errorMessage = error.error.error;
            } else if (error.error?.detail) {
              errorMessage = error.error.detail;
            } else {
              errorMessage = `Error ${error.status}: ${error.message}`;
            }
        }
      }

      // Show error toast
      toastService.error(errorMessage);

      return throwError(() => error);
    })
  );
};