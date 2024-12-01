import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-agregar-mascota',
  templateUrl: './agregar-mascota.page.html',
  styleUrls: ['./agregar-mascota.page.scss'],
})
export class AgregarMascotaPage implements OnInit {
  mascota = {
    nombre: '',
    edad: 0,
    raza: '',
    color: '',
    photo: null as string | null,
    latitude: null as number | null,
    longitude: null as number | null,
  };
  userId: number = 0;

  constructor(
    private sqliteService: SqliteService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.userId = user.id;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      this.router.navigate(['/login']);
    }
  }

  async agregarMascota() {
    if (!this.mascota.nombre || !this.mascota.raza || !this.mascota.color) {
      // Podrías mostrar un alert o toast aquí
      console.error('Todos los campos son obligatorios');
      return;
    }

    try {
      await this.sqliteService.addMascota(
        this.mascota.nombre,
        this.mascota.edad,
        this.mascota.raza,
        this.mascota.color,
        this.mascota.photo,
        this.mascota.latitude,
        this.mascota.longitude,
        this.userId
      );
      console.log('Mascota agregada con éxito');
      this.router.navigate(['/inicio']);
    } catch (error) {
      console.error('Error al agregar mascota:', error);
      // Podrías mostrar un alert o toast aquí
    }
  }
}
