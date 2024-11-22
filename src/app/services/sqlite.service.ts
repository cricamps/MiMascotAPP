import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {}

  // Inicialización de la base de datos
  async initializeDatabase() {
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'mascotas.db', // Nombre de la base de datos
        location: 'default', // Almacenamiento por defecto
      });

      // Crear tabla de mascotas si no existe
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS mascotas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          edad INTEGER,
          raza TEXT,
          color TEXT,
          userId INTEGER
        )`,
        []
      );

      // Crear tabla de usuarios si no existe
      await this.dbInstance.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          email TEXT
        )`,
        []
      );

      console.log('Base de datos inicializada.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  // Métodos relacionados con mascotas
  async addMascota(nombre: string, edad: number, raza: string, color: string, userId: number) {
    const query = `INSERT INTO mascotas (nombre, edad, raza, color, userId) VALUES (?, ?, ?, ?, ?)`;
    try {
      await this.dbInstance?.executeSql(query, [nombre, edad, raza, color, userId]);
      console.log('Mascota agregada:', nombre);
    } catch (error) {
      console.error('Error al agregar mascota:', error);
    }
  }

  async getMascotasByUser(userId: number) {
    const query = `SELECT * FROM mascotas WHERE userId = ?`;
    try {
      const res = await this.dbInstance?.executeSql(query, [userId]);
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

  async getAllMascotas() {
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
      console.error('Error al obtener todas las mascotas:', error);
      return [];
    }
  }

  async deleteMascota(id: number) {
    const query = `DELETE FROM mascotas WHERE id = ?`;
    try {
      await this.dbInstance?.executeSql(query, [id]);
      console.log('Mascota eliminada con éxito:', id);
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
    }
  }

  // Métodos relacionados con usuarios
  async addUser(username: string, password: string, email: string) {
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    try {
      await this.dbInstance?.executeSql(query, [username, password, email]);
      console.log('Usuario registrado:', username);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  async validateUser(username: string, password: string) {
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    try {
      const res = await this.dbInstance?.executeSql(query, [username, password]);
      if (res.rows.length > 0) {
        return res.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error al validar usuario:', error);
      return null;
    }
  }
}
