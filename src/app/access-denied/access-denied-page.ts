import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-access-denied',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ 'ACCESS_DENIED.TITLE' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ion-text-center">
      <div class="access-denied-container">
        <ion-icon name="alert-circle-outline" color="danger" class="error-icon"></ion-icon>
        <h2>{{ 'ACCESS_DENIED.HEADING' | translate }}</h2>
        <p>{{ 'ACCESS_DENIED.MESSAGE' | translate }}</p>
        <ion-button expand="block" (click)="goBack()">
          {{ 'ACCESS_DENIED.GO_BACK' | translate }}
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .access-denied-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }
    .error-icon {
      font-size: 64px;
      color: var(--ion-color-danger);
      margin-bottom: 20px;
    }
    h2 {
      margin: 20px 0;
      color: var(--ion-color-danger);
    }
    p {
      margin-bottom: 30px;
      color: var(--ion-color-medium);
    }
    ion-button {
      margin-top: 20px;
    }
  `]
})
export class AccessDeniedPage {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async goBack() {
    const user = await this.authService.getCurrentUser();
    if (user?.role === 'admin') {
      await this.router.navigate(['/home']);
    } else {
      await this.router.navigate(['/inicio']);
    }
  }
}