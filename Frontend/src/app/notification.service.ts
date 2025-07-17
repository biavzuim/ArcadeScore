import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<{ message: string; type: 'alert' | 'error' }>();

  constructor() { }

  // Method to show a general alert message
  showAlert(message: string): void {
    this.notificationSubject.next({ message, type: 'alert' });
    console.log(`Alert: ${message}`);
    // Implement actual UI display for alerts (e.g., a toast)
  }

  // Method to show an error message
  showError(message: string): void {
    this.notificationSubject.next({ message, type: 'error' });
    console.error(`Error: ${message}`);
    // Implement actual UI display for errors (e.g., a red toast)
  }

  // Observable to subscribe to for displaying notifications in a UI component
  getNotifications(): Observable<{ message: string; type: 'alert' | 'error' }> {
    return this.notificationSubject.asObservable();
  }
}