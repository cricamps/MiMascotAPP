import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-agregar-mascota',
  templateUrl: './agregar-mascota.page.html',
  styleUrls: ['./agregar-mascota.page.scss'],
})
export class AgregarMascotaPage {
  // Objeto para almacenar los datos de la mascota
  mascota = {
    nombre: '',
    edad: null,
    raza: '',
    color: ''
  };

  userId: number = 1; // ID del usuario actual (puedes obtenerlo dinámicamente)

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async guardarMascota() {
    // Validar que todos los campos estén completos
    if (!this.mascota.nombre || !this.mascota.edad || !this.mascota.raza || !this.mascota.color) {
      console.error('Todos los campos son obligatorios');
      return;
    }

    try {
      // Agregar mascota a la base de datos
      await this.sqliteService.addMascota(
        this.mascota.nombre,
        this.mascota.edad,
        this.mascota.raza,
        this.mascota.color,
        this.userId
      );
      console.log('Mascota guardada exitosamente.');
      this.router.navigate(['/inicio']); // Redirige a la página de inicio
    } catch (error) {
      console.error('Error al guardar la mascota:', error);
    }
  }
}
