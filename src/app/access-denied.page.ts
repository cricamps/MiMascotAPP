import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.page.html',
  styleUrls: ['./access-denied.page.scss'],
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