import { Component, OnInit, inject, NgZone } from '@angular/core';
import { OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  private readonly eventService = inject(PublicEventsService);

  configuration$ = this.oidcSecurityService.getConfiguration();

  userData$ = this.oidcSecurityService.userData$;

  isAuthenticated = false;

  checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;
  //checkSessionChanged$ = new BehaviorSubject(true);

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;

        console.warn('isAuthenticated: ', isAuthenticated);
      }
    );

    this.eventService.registerForEvents().subscribe(event => {
      console.log('home:registerForEvents', event)
      console.log('home:registerForEvents:isInAngularZone', NgZone.isInAngularZone())
    });

    this.checkSessionChanged$.subscribe(change => {
      console.log('home:checkSessionChanged$', change)
      console.log('home:checkSessionChanged$:isInAngularZone', NgZone.isInAngularZone())
    });
  }

  ngDoCheck() {
    console.log('home:ngDoCheck');
  }

  login(): void {
    console.log('start login');
    this.oidcSecurityService.authorize();
  }

  refreshSessionCheckSession(): void {
    console.log('start refreshSession');
    this.oidcSecurityService.authorize();
  }

  forceRefreshSession(): void {
    this.oidcSecurityService
      .forceRefreshSession()
      .subscribe((result) => console.log(result));
  }

  logout(): void {
    console.log('start logoff');
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }
}
