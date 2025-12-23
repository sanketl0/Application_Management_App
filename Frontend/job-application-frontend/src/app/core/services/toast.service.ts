import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show success message
   */
  success(message: string, duration: number = 3000): void {
    this.show(message, 'success-snackbar', duration);
  }

  /**
   * Show error message
   */
  error(message: string, duration: number = 4000): void {
    this.show(message, 'error-snackbar', duration);
  }

  /**
   * Show info message
   */
  info(message: string, duration: number = 3000): void {
    this.show(message, 'info-snackbar', duration);
  }

  /**
   * Show warning message
   */
  warning(message: string, duration: number = 3000): void {
    this.show(message, 'warning-snackbar', duration);
  }

  /**
   * Generic show method
   */
  private show(message: string, panelClass: string, duration: number): void {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    };

    this.snackBar.open(message, 'Close', config);
  }
}