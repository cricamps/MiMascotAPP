import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const isAuthenticated = await this.authService.isAuthenticated();
    
    if (!isAuthenticated) {
      await this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    if (route.data['role']) {
      const hasRole = await this.authService.hasRole(route.data['role']);
      if (!hasRole) {
        await this.router.navigate(['/access-denied']);
        return false;
      }
    }

    return true;
  }
}