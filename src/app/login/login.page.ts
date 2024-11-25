import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  error: string | null = null;

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async login() {
    try {
      const user = await this.sqliteService.validateUser(this.username, this.password);
      if (user) {
        if (user.role === 'admin') {
          this.router.navigate(['/home']); // Navega a home para administradores
        } else {
          this.router.navigate(['/inicio']); // Navega a inicio para usuarios normales
        }
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
    }
  }

  clearField(field: 'username' | 'password'): void {
    if (field === 'username') {
      this.username = '';
    } else if (field === 'password') {
      this.password = '';
    }
  }
}
