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
  error: string = '';

  constructor(private router: Router, private sqliteService: SqliteService) {}

  async register() {
    try {
      if (!this.username || !this.password || !this.email) {
        this.error = 'Todos los campos son obligatorios.';
        return;
      }

      // Agregar usuario a la base de datos
      await this.sqliteService.addUser(this.username, this.password, this.email);
      this.error = '';
      this.router.navigate(['/login']); // Redirigir al login después del registro
    } catch (err) {
      this.error = 'Error al registrar el usuario. Intente nuevamente.';
      console.error(err);
    }
  }
}
