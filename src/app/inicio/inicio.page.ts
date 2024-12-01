import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  mascotas: any[] = [];
  userId: number = 1;

  constructor(
    private animationCtrl: AnimationController,
    private sqliteService: SqliteService
  ) {}

  async ngOnInit() {
    try {
      await this.sqliteService.initializeDatabase();
      await this.cargarMascotas();
      this.playAnimation();
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }

  async ionViewWillEnter() {
    await this.cargarMascotas();
  }

  async cargarMascotas() {
    try {
      this.mascotas = await this.sqliteService.getMascotasByUser(this.userId);
      console.log('Mascotas cargadas:', this.mascotas);
    } catch (error) {
      console.error('Error al cargar las mascotas:', error);
    }
  }

  async eliminarMascota(id: number) {
    try {
      await this.sqliteService.deleteMascota(id);
      this.mascotas = await this.sqliteService.getMascotasByUser(this.userId);
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
