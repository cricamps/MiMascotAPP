import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SqliteService } from './services/sqlite.service'; // Importa el servicio SQLite

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private sqliteService: SqliteService // Inyecta el servicio SQLite
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    // Configuración de idiomas
    this.translate.setDefaultLang('es');
    this.translate.use('es');

    // Inicialización de la base de datos
    try {
      await this.sqliteService.initializeDatabase();
      console.log('Base de datos inicializada correctamente.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }
}
