import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  username: string = '';
  password: string = '';
  email: string = '';
  error: string | null = null;

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async register() {
    if (!this.username || !this.password || !this.email) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }
  
    try {
      const existingUser = await this.sqliteService.validateUsername(this.username);
      if (existingUser) {
        this.error = 'El nombre de usuario ya está registrado.';
        return;
      }
  
      await this.sqliteService.addUser(this.username, this.password, this.email);
      console.log('Usuario registrado con éxito.');
      this.error = null;
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      this.error = 'No se pudo registrar el usuario. Verifica la consola para más detalles.';
    }
  }
  
}  
