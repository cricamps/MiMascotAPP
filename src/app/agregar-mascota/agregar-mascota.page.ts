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
    photo: null,
    latitude: null,
    longitude: null,
  };
  userId: number;

  constructor(private sqliteService: SqliteService, private router: Router) {}

  async ngOnInit() {
    // Obtener el userId del almacenamiento local o sesión
    this.userId = /* Lógica para obtener el ID del usuario actual */;
  }

  async agregarMascota() {
    try {
      await this.sqliteService.addMascota(
        this.mascota.nombre,
        this.mascota.edad,
        this.mascota.raza,
        this.mascota.color,
        this.mascota.photo || null,
        this.mascota.latitude || null,
        this.mascota.longitude || null,
        this.userId
      );
      console.log('Mascota agregada con éxito');
      this.router.navigate(['/inicio']);
    } catch (error) {
      console.error('Error al agregar mascota:', error);
    }
  }
}
