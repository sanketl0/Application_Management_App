import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Show loading spinner
   */
  show(): void {
    this.loadingSubject.next(true);
  }

  /**
   * Hide loading spinner
   */
  hide(): void {
    this.loadingSubject.next(false);
  }
}