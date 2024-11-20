import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  mascotas: any[] = []; // Lista dinámica de mascotas

  constructor(
    private animationCtrl: AnimationController,
    private sqliteService: SqliteService
  ) {}

  async ngOnInit() {
    try {
      await this.sqliteService.initializeDatabase(); // Inicializa la base de datos
      await this.cargarMascotas(); // Carga la lista de mascotas
      this.playAnimation(); // Activa la animación
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }

  async ionViewWillEnter() {
    await this.cargarMascotas(); // Actualiza la lista de mascotas al volver a la página
  }

  async cargarMascotas() {
    try {
      this.mascotas = await this.sqliteService.getMascotas(); // Obtiene las mascotas desde la base de datos
      console.log('Mascotas cargadas:', this.mascotas);
    } catch (error) {
      console.error('Error al cargar las mascotas:', error);
    }
  }

  async eliminarMascota(id: number) {
    try {
      await this.sqliteService.deleteMascota(id); // Elimina una mascota por ID
      this.mascotas = await this.sqliteService.getMascotas(); // Actualiza la lista después de eliminar
      console.log('Mascota eliminada con éxito:', id);
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
    }
  }

  playAnimation() {
    const element = document.querySelector('.animated-list');

    if (element) {
      const animation = this.animationCtrl.create()
        .addElement(element)
        .duration(1000)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateX(-100px)', 'translateX(0)');
      animation.play();
    } else {
      console.error('Elemento no encontrado: .animated-list');
    }
  }
}
