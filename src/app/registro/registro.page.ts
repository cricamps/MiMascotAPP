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
    this.error = null;

    if (!this.username || !this.password || !this.email) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    try {
      const existingUser = await this.sqliteService.validateUser(this.username, this.password);


      if (existingUser) {
        this.error = 'El usuario ya existe. Prueba con otro nombre de usuario.';
        return;
      }

      await this.sqliteService.addUser(this.username, this.password, this.email);
      console.log('Usuario registrado con éxito');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      this.error = 'Error al registrar el usuario. Intente nuevamente.';
    }
  }
}
