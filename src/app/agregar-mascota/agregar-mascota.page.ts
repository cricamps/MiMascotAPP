import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-agregar-mascota',
  templateUrl: './agregar-mascota.page.html',
  styleUrls: ['./agregar-mascota.page.scss'],
})
export class AgregarMascotaPage {
  mascota = {
    nombre: '',
    edad: null,
    raza: '',
    color: '',
  };

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async guardarMascota() {
    if (!this.mascota.nombre || !this.mascota.edad || !this.mascota.raza || !this.mascota.color) {
      console.error('Todos los campos son obligatorios');
      return;
    }

    try {
      await this.sqliteService.addMascota(
        this.mascota.nombre,
        this.mascota.edad,
        this.mascota.raza,
        this.mascota.color
      );
      console.log('Mascota guardada exitosamente.');
      this.router.navigate(['/inicio']); // Redirige a la página de inicio
    } catch (error) {
      console.error('Error al guardar la mascota:', error);
    }
  }
}
