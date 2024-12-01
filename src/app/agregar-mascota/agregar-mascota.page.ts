
import { Component } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-agregar-mascota',
  templateUrl: './agregar-mascota.page.html',
  styleUrls: ['./agregar-mascota.page.scss'],
})
export class AgregarMascotaPage {
  mascota = {
    nombre: '',
    edad: 0, // Default to 0 to avoid null issues
    raza: '',
    color: '',
    photo: null,
    latitude: null,
    longitude: null,
  };
  userId = 1; // Example user ID

  constructor(private sqliteService: SqliteService) {}

  async agregarMascota() {
    try {
      await this.sqliteService.addMascota(
        this.mascota.nombre,
        this.mascota.edad || 0, // Ensure edad is a number
        this.mascota.raza,
        this.mascota.color,
        this.mascota.photo || null,
        this.mascota.latitude || null,
        this.mascota.longitude || null,
        this.userId
      );
      console.log('Mascota agregada con éxito');
    } catch (error) {
      console.error('Error al agregar mascota:', error);
    }
  }
}
