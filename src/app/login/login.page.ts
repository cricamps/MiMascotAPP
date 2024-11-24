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
    if (!this.username || !this.password) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    try {
      const user = await this.sqliteService.validateUser(this.username, this.password);
      if (user) {
        console.log('Inicio de sesión exitoso:', user);
        this.router.navigate(['/inicio']); // Navega al inicio si el usuario es válido
      } else {
        this.error = 'Usuario o contraseña incorrectos.';
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.error = 'Hubo un problema al iniciar sesión. Inténtalo nuevamente.';
    }
  }

  clearField(field: 'username' | 'password') {
    if (field === 'username') {
      this.username = '';
    } else if (field === 'password') {
      this.password = '';
    }
  }
}
