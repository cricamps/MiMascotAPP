import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const isAuthenticated = await this.authService.isAuthenticated();
    
    if (isAuthenticated) {
      const user = await this.authService.getCurrentUser();
      if (user?.role === 'admin') {
        await this.router.navigate(['/home']);
      } else {
        await this.router.navigate(['/inicio']);
      }
      return false;
    }

    return true;
  }
}