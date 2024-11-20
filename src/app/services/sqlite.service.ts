import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {}

  async initializeDatabase() {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'mascotas.db', // Nombre de la base de datos
        location: 'default', // Almacenamiento por defecto
      });

      // Crear tabla si no existe
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS mascotas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          edad INTEGER,
          raza TEXT,
          color TEXT
        )`,
        []
      );
      console.log('Base de datos inicializada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  async addMascota(nombre: string, edad: number, raza: string, color: string) {
    const query = `INSERT INTO mascotas (nombre, edad, raza, color) VALUES (?, ?, ?, ?)`;
    try {
      await this.dbInstance?.executeSql(query, [nombre, edad, raza, color]);
      console.log('Mascota agregada:', nombre);
    } catch (error) {
      console.error('Error al agregar mascota:', error);
    }
  }

  async getMascotas() {
    const query = `SELECT * FROM mascotas`;
    try {
      const res = await this.dbInstance?.executeSql(query, []);
      const mascotas = [];
      if (res) {
        for (let i = 0; i < res.rows.length; i++) {
          mascotas.push(res.rows.item(i));
        }
      }
      return mascotas;
    } catch (error) {
      console.error('Error al obtener mascotas:', error);
      return [];
    }
  }
  

  // Eliminar una mascota por ID
  async deleteMascota(id: number) {
    const query = `DELETE FROM mascotas WHERE id = ?`;
    return this.dbInstance?.executeSql(query, [id]);
  }
}
