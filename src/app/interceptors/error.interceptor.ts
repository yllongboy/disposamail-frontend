import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const USER_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'You are not authorized to perform this action.',
  403: 'Access denied.',
  404: 'The requested resource was not found.',
  429: 'Too many requests. Please try again later.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string;

      if (error.status === 0) {
        message = 'Unable to connect to server. Please check your connection.';
      } else if (error.status >= 500) {
        message = 'Our servers are temporarily unavailable. Please try again later.';
      } else if (error.error && typeof error.error.error === 'string') {
        message = error.error.error;
      } else {
        message = USER_MESSAGES[error.status] || 'Something went wrong. Please try again.';
      }

      return throwError(() => ({ message, status: error.status }));
    })
  );
};