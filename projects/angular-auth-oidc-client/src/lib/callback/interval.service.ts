import { Injectable, NgZone, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class IntervalService {
  private readonly zone = inject(NgZone);

  private readonly document = inject(DOCUMENT);

  runTokenValidationRunning: Subscription | null = null;

  isTokenValidationRunning(): boolean {
    return Boolean(this.runTokenValidationRunning);
  }

  stopPeriodicTokenCheck(): void {
    if (this.runTokenValidationRunning) {
      this.runTokenValidationRunning.unsubscribe();
      this.runTokenValidationRunning = null;
    }
  }

  startPeriodicTokenCheck(repeatAfterSeconds: number): Observable<unknown> {
    const millisecondsDelayBetweenTokenCheck = repeatAfterSeconds * 1000;

    return new Observable((subscriber) => {
      let intervalId: number | undefined;

      this.zone.runOutsideAngular(() => {
        intervalId = this.document?.defaultView?.setInterval(
          // TODO Doing this breaks change detection
          // () => this.zone.run(() => subscriber.next()),
          () => subscriber.next(),
          millisecondsDelayBetweenTokenCheck
        );
      });

      return (): void => {
        clearInterval(intervalId);
      };
    });
  }
}

