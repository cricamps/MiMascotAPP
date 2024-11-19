import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  mascotas = [
    { nombre: 'Luna' },
    { nombre: 'Jazmín' },
    { nombre: 'Raya' },
  ];

  items: any[] = []; // Variable para almacenar los datos de SQLite

  constructor(
    private animationCtrl: AnimationController,
    private sqliteService: SqliteService
  ) {}

  ngOnInit() {
    this.playAnimation();
    this.initializeDatabase();
  }

  // Método para inicializar la base de datos y cargar los datos
  async initializeDatabase() {
    try {
      await this.sqliteService.initializeDatabase();
      this.items = await this.sqliteService.getItems();
      console.log('Items cargados:', this.items);
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
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

  async addItem() {
    try {
      await this.sqliteService.addItem('Nuevo Item');
      this.items = await this.sqliteService.getItems(); // Actualiza la lista después de agregar
    } catch (error) {
      console.error('Error al agregar el item:', error);
    }
  }
}
